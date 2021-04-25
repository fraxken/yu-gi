import { Card } from "./Card";

const StarterCards = Object.freeze([
    new Card("First Card", function () { console.log("sword") }, "shield", "speedBoost", "nuke", 1),
    new Card("Second Card", function () { console.log("bow") }, "sideDodge", "speedBoost", "nuke", 3),
    new Card("Third Card", function () { console.log("spear") }, "backDodge", "speedBoost", "nuke", 2),
    new Card("Fourth Card", function () { console.log("axe") }, "roll", "speedBoost", "nuke", 4),
    new Card("Fifth Card", function () { console.log("crossbow") }, "parry", "speedBoost", "nuke", 2),
    new Card("Sixth Card", function () { console.log("hammer") }, "roll", "speedBoost", "nuke", 2)
]);

const AdditionalCards = Object.freeze([
    new Card("Seventh Card", function () { console.log("knife") }, "shield", "speedBoost", "nuke", 2),
    new Card("Eighth Card", function () { console.log("crossbow") }, "shield", "speedBoost", "nuke", 2),
    new Card("Nineth Card", function () { console.log("wand") }, "shield", "speedBoost", "nuke", 2),
    new Card("Tenth Card", function () { console.log("spear") }, "shield", "speedBoost", "nuke", 2)
]);

const SkillIndex = Object.freeze({
    Offensive: 0,
    Defensive: 1,
    Passive: 2,
    Consumable: 3
});

const MAK_NUMBER_OF_CARDS_IN_SLOT_HUD = 4;
const MAX_NUMBER_OF_CARDS_IN_RECUPERATOR = 5;

export class Deck {
    constructor() {
        this.discardedCards = [];

        this.cardDraw = Array.from(StarterCards);
        this.shuffleCardDraw();

        this.lockedCard = [];
        this.recuperator = [];

        this.slotHUD = [];
        this.initSlotHUD();

        this.debugLog();
    }

    loadIntoHUD() {
        window.hudevents.emit("offensive_card", this.slotHUD[0]);
        window.hudevents.emit("defensive_card", this.slotHUD[1]);
        window.hudevents.emit("passive_card", this.slotHUD[2]);
        window.hudevents.emit("consomable_card", this.slotHUD[3]);
    }

    updateRecuperator() {
        this.recuperator.push(...this.lockedCard);

        while (this.recuperator.length > MAX_NUMBER_OF_CARDS_IN_RECUPERATOR) {
            const minNumberOfStars = Math.min.apply(Math, this.recuperator.map(card => card.stars));
            const indexToRemove = this.recuperator.findIndex(card => card.stars === minNumberOfStars);
            this.recuperator.splice(indexToRemove, 1);
        }
    }

    shuffleCardDraw() {
        // Fisher-Yates shuffle
        for (let i = this.cardDraw.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cardDraw[i], this.cardDraw[j]] = [this.cardDraw[j], this.cardDraw[i]];
        }
    }

    initSlotHUD() {
        for (let i = 0; i < MAK_NUMBER_OF_CARDS_IN_SLOT_HUD; ++i) {
            this.slotHUD.push(this.pick());
        }
    }

    pick() {
        if (this.slotHUD.length >= MAK_NUMBER_OF_CARDS_IN_SLOT_HUD) {
            return;
        }
        if (this.cardDraw.length === 0 && this.discard.length !== 0) {
            this.cardDraw = Array.from(this.discardedCards);
            this.discardedCards = [];
            this.shuffleCardDraw();
        }

        return this.cardDraw.pop();
    }

    discard(card) {
        this.discardedCards.push(card);
    }

    dump(card) {
        this.lockedCard.push(card);
    }

    recover(cardIndex) {
        const cardToRecover = this.lockedCard.splice(cardIndex, 1);
        if (cardToRecover) {
            this.cardDraw.unshift(cardToRecover);
        }
    }

    useOffensiveSkill() {
        this.slotHUD[SkillIndex.Offensive].offensiveSkill();

        this.discard(this.slotHUD[SkillIndex.Offensive]);

        this.slotHUD.splice(SkillIndex.Offensive, 1);
        this.slotHUD.splice(SkillIndex.Offensive, 0, this.pick());

        window.hudevents.emit("offensive_card", this.slotHUD[0]);

        this.debugLog();
    }

    useDefensiveSkill() {
        this.discard(this.slotHUD[SkillIndex.Defensive]);

        this.slotHUD.splice(SkillIndex.Defensive, 1);
        this.slotHUD.splice(SkillIndex.Defensive, 0, this.pick());

        window.hudevents.emit("defensive_card", this.slotHUD[1]);

        this.debugLog();
    }

    useConsumable() {
        if (this.slotHUD[SkillIndex.Consumable]) {
            this.dump(this.slotHUD[SkillIndex.Consumable])

            this.slotHUD.splice(SkillIndex.Consumable, 1);
            this.slotHUD.splice(SkillIndex.Consumable, 0, this.pick());
        }

        window.hudevents.emit("consomable_card", this.slotHUD[3]);

        this.debugLog();
    }

    carouselSlot() {
        this.slotHUD = Array.from([
            this.slotHUD[3],
            this.slotHUD[0],
            this.slotHUD[1],
            this.slotHUD[2]
        ]);

        window.hudevents.emit("offensive_card", this.slotHUD[0]);
        window.hudevents.emit("defensive_card", this.slotHUD[1]);
        window.hudevents.emit("passive_card", this.slotHUD[2]);
        window.hudevents.emit("consomable_card", this.slotHUD[3]);

        this.debugLog();
    }

    debugLog() {
        if (true) {
            console.log("DISCARDED CARDS:", this.discardedCards);
            console.log("CARDDRAW:", this.cardDraw);
            console.log("HUD SLOTS:", this.slotHUD);
            console.log("RECUPERATOR:", this.lockedCard);
        }
    }
}
