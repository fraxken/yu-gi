import { State } from "../../ECS";
import { StarterCards } from "./Card";

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
        this.lockedCard = [];
        this.recuperator = [];
        this.slotHUD = [];
        this.deckState = new State("deck", {
            slotHUD: {},
            discard: [],
            draw: [],
            lockedCard: [],
            recuperator: [],
        });
        this.deckState.reset();

        this.shuffleCardDraw();
        this.initSlotHUD();

        this.debugLog();
    }

    loadState() {
        this.deckState.setState("slotHUD.offensive", this.slotHUD[SkillIndex.Offensive]);
        this.deckState.setState("slotHUD.defensive", this.slotHUD[SkillIndex.Defensive]);
        this.deckState.setState("slotHUD.passive", this.slotHUD[SkillIndex.Passive]);
        this.deckState.setState("slotHUD.consumable", this.slotHUD[SkillIndex.Consumable]);
        this.deckState.setState("discard", this.discardedCards);
        this.deckState.setState("draw", this.cardDraw);
        this.deckState.setState("lockedCard", this.lockedCard);
        this.deckState.setState("recuperator", this.recuperator);

        this.slotHUD[SkillIndex.Passive].activatePassive();
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
            this.deckState.setState("discard", this.discardedCards);
            this.shuffleCardDraw();
        }
        const pickedCard = this.cardDraw.pop()

        this.deckState.setState("draw", this.cardDraw);

        return pickedCard;
    }

    discard(card) {
        this.discardedCards.push(card);
        this.deckState.setState("discard", this.discardedCards);
    }

    dump(card) {
        this.lockedCard.push(card);
        this.deckState.setState("lockedCard", this.lockedCard);
    }

    recover(cardIndex) {
        const cardToRecover = this.lockedCard.splice(cardIndex, 1);
        if (cardToRecover) {
            this.cardDraw.unshift(cardToRecover);
        }
        this.deckState.setState("lockedCard", this.lockedCard);
        this.deckState.setState("draw", this.cardDraw);
    }

    useOffensiveSkill() {
        this.slotHUD[SkillIndex.Offensive].attack();

        this.discard(this.slotHUD[SkillIndex.Offensive]);

        this.slotHUD.splice(SkillIndex.Offensive, 1);
        this.slotHUD.splice(SkillIndex.Offensive, 0, this.pick());

        this.deckState.setState("slotHUD.offensive", this.slotHUD[SkillIndex.Offensive]);

        this.debugLog();
    }

    useDefensiveSkill() {
        this.discard(this.slotHUD[SkillIndex.Defensive]);

        this.slotHUD.splice(SkillIndex.Defensive, 1);
        this.slotHUD.splice(SkillIndex.Defensive, 0, this.pick());

        this.deckState.setState("slotHUD.defensive", this.slotHUD[SkillIndex.Defensive]);

        this.debugLog();
    }

    useConsumable() {
        if (this.slotHUD[SkillIndex.Consumable]) {
            this.dump(this.slotHUD[SkillIndex.Consumable])

            this.slotHUD.splice(SkillIndex.Consumable, 1);
            this.slotHUD.splice(SkillIndex.Consumable, 0, this.pick());
        }

        this.deckState.setState("slotHUD.consumable", this.slotHUD[SkillIndex.Consumable]);

        this.debugLog();
    }

    carouselSlot() {
        this.slotHUD[SkillIndex.Passive].deactivatePassive();

        if (!this.slotHUD[SkillIndex.Consumable]) {
            console.log("NO CONSUMABLE CARD");
            this.slotHUD = Array.from([
                this.slotHUD[SkillIndex.Passive],
                this.slotHUD[SkillIndex.Offensive],
                this.slotHUD[SkillIndex.Defensive],
                this.slotHUD[SkillIndex.Consumable]
            ]);
        } else {
            this.slotHUD = Array.from([
                this.slotHUD[SkillIndex.Consumable],
                this.slotHUD[SkillIndex.Offensive],
                this.slotHUD[SkillIndex.Defensive],
                this.slotHUD[SkillIndex.Passive]
            ]);
        }

        this.slotHUD[SkillIndex.Passive].activatePassive();

        this.deckState.setState("slotHUD.offensive", this.slotHUD[SkillIndex.Offensive]);
        this.deckState.setState("slotHUD.defensive", this.slotHUD[SkillIndex.Defensive]);
        this.deckState.setState("slotHUD.passive", this.slotHUD[SkillIndex.Passive]);
        this.deckState.setState("slotHUD.consumable", this.slotHUD[SkillIndex.Consumable]);

        this.debugLog();
    }

    moveCardInDraw(cardIndex, destinationIndex) {
        const cardToMove = this.cardDraw.splice(cardIndex, 1);

        this.cardDraw.splice(destinationIndex, 0, ...cardToMove);

        this.deckState.setState("draw", this.cardDraw);
    }

    moveCardFromDrawToSlot(cardIndex, slotName) {
        const cardToMove = this.cardDraw.splice(cardIndex, 1);

        const cardToExchange = this.slotHUD[SkillIndex[slotName]];
        if (cardToExchange !== null && cardToExchange !== undefined) {
            this.cardDraw.splice(cardIndex, 0, cardToExchange);
        }
        this.slotHUD[SkillIndex[slotName]] = cardToMove[0];

        this.deckState.setState("draw", this.cardDraw);
        this.deckState.setState("slot." + String(slotName).toLowerCase(), this.slotHUD[slotName]);
    }

    moveCardFromSlotToDraw(slotName, destinationIndex) {
        const cardToMove = this.slotHUD[SkillIndex[slotName]];

        const cardToExchange = this.cardDraw.splice(destinationIndex, 1, cardToMove);
        if (cardToExchange[0] !== null && cardToExchange[0] !== undefined) {
            this.slotHUD[SkillIndex[slotName]] = cardToExchange[0];
        }

        this.deckState.setState("draw", this.cardDraw);
        this.deckState.setState("slot." + String(slotName).toLowerCase(), this.slotHUD[slotName]);
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
