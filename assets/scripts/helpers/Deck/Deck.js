import { Card } from "./Card";

const GameCards = Object.freeze([
    new Card("First Card", function () { console.log("sword") }, "shield", "speedBoost", "nuke", 2),
    new Card("Second Card", function () { console.log("bow") }, "sideDodge", "speedBoost", "nuke", 3),
    new Card("Third Card", function () { console.log("spear") }, "backDodge", "speedBoost", "nuke", 2),
    new Card("Fourth Card", function () { console.log("axe") }, "roll", "speedBoost", "nuke", 4),
    new Card("Fifth Card", function () { console.log("hammer") }, "parry", "speedBoost", "nuke", 2),
    new Card("Sixth Card", function () { console.log("hammer") }, "roll", "speedBoost", "nuke", 2),
    new Card("Seventh Card", function () { console.log("axe") }, "shield", "speedBoost", "nuke", 2)
]);

const SkillIndex = Object.freeze({
    Offensive: 0,
    Defensive: 1,
    Passive: 2,
    Consumable: 3
});

const MAK_NUMBER_OF_CARDS_IN_SLOT_HUD = 4;

export class Deck {
    constructor() {
        this.discardedCards = [];

        this.cardDraw = Array.from(GameCards);
        this.shuffleCardDraw();

        this.recuperator = [];

        this.slotHUD = [];
        this.initSlotHUD();
    }

    shuffleCardDraw() {
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
        this.recuperator.push(card);
    }

    useOffensiveSkill() {
        this.slotHUD[SkillIndex.Offensive].offensiveSkill();

        this.discard(this.slotHUD[SkillIndex.Offensive]);

        this.slotHUD.splice(SkillIndex.Offensive, 1);
        this.slotHUD.splice(SkillIndex.Offensive, 0, this.pick());
    }

    useDefensiveSkill() {
        this.discard(this.slotHUD[SkillIndex.Defensive]);

        this.slotHUD.splice(SkillIndex.Defensive, 1);
        this.slotHUD.splice(SkillIndex.Defensive, 0, this.pick());
    }

    useConsumable() {
        if (this.slotHUD[SkillIndex.Consumable]) {
            this.dump(this.slotHUD[SkillIndex.Consumable])

            this.slotHUD.splice(SkillIndex.Consumable, 1);
            this.slotHUD.splice(SkillIndex.Consumable, 0, this.pick());
        }
    }

    carouselSlot() {
        this.slotHUD = Array.from([
            this.slotHUD[3],
            this.slotHUD[0],
            this.slotHUD[1],
            this.slotHUD[2]
        ]); // LOOKS SHITTY
    }
}
