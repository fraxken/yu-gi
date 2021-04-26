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
    new Card("First Card", "sword", "shieldParry", "attackDamageBoost", "healthUp", 1),
    new Card("Second Card", "bow", "shieldDefense", "attackDamageBoost", "healthUp", 3),
    new Card("Third Card", "spear", "shieldDefense", "attackDamageBoost", "healthUp", 2),
    new Card("Fourth Card", "axe", "dodge", "attackDamageBoost", "healthUp", 2),
    new Card("Fifth Card", "crossbow", "shieldParry", "defenseBoost", "healthUp", 2),
    new Card("Sixth Card", "hammer", "dodge", "defenseBoost", "invincible", 2),
    new Card("Seventh Card", "knife", "counter", "defenseBoost", "elementaryImmunity", 2),
    new Card("Eighth Card", "crossbow", "dash", "defenseBoost", "discardToChest", 2),
    new Card("Nineth Card", "spell", "dash", "elementaryDamage", "deckToChest", 2),
    new Card("Tenth Card", "spear", "shieldDefense", "attackRangeBoost", "secretVision", 2)
]);
/*
export const AdditionalCards = Object.freeze([
    new Card("Eighth Card", "crossbow", "dash", "speedBoost", "discardToChest", 2),
    new Card("Nineth Card", "wand", "dash", "elementaryDamage", "deckToChest", 2),
    new Card("Tenth Card", "spear", "shieldDefense", "attackRangeBoost", "secretVision", 2)
]); */
