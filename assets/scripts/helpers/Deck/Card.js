import { ConsumableSkills, DefensiveSkills, OffensiveSkills, PassiveSkills } from "./Skill";

const MAX_STAR_LEVEL = 10;

export class Card {
    constructor(name, offensiveSkillName, defensiveSkillName, passiveSkillName, consumableSkillName, stars) {
        this.name = name;
        this.offensiveSkill = OffensiveSkills[offensiveSkillName];
        this.defensiveSkill = DefensiveSkills[defensiveSkillName];
        this.passiveSkill = PassiveSkills[passiveSkillName];
        this.consumableSkill = ConsumableSkills[consumableSkillName];
        this.stars = stars;
    }

    upgrade() {
        if (this.stars < 10) { ++this.stars; }
        else { console.log("ALREADY AT LEVEL MAX") }
    }

    attack() {
        this.offensiveSkill.use();
    }

    defend() {
        this.defensiveSkill.use();
    }

    activatePassive() {
        this.passiveSkill.activate(this.stars);
    }

    deactivatePassive() {
        this.passiveSkill.deactivate();
    }

    consume() {
        this.consumableSkill.use();
    }
}

export const StarterCards = Object.freeze([
    new Card("First Card", "sword", "shield", "speed", "heal", 1),
    new Card("Second Card", "bow", "shield", "speed", "heal", 3),
    new Card("Third Card", "spear", "shield", "speed", "invincible", 2),
    new Card("Fourth Card", "axe", "dodge", "speed", "heal", 2),
    new Card("Fifth Card", "crossbow", "shield", "defense", "heal", 2),
    new Card("Sixth Card", "hammer", "dodge", "defense", "invincible", 2),
    new Card("Seventh Card", "knife", "counter", "defense", "resistance", 3),
    new Card("Eighth Card", "crossbow", "dash", "defense", "resistance", 4),
    new Card("Nineth Card", "spell", "dash", "special", "invincible", 2),
    new Card("Tenth Card", "spear", "shield", "attack", "secretVision", 2)
]);
/*
export const AdditionalCards = Object.freeze([
    new Card("Eighth Card", "crossbow", "dash", "speed", "discardToChest", 2),
    new Card("Nineth Card", "wand", "dash", "special", "deckToChest", 2),
    new Card("Tenth Card", "spear", "shield", "attackRangeBoost", "secretVision", 2)
]); */
