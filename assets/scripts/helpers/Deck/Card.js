import { OffensiveSkills, PassiveSkills } from "./Skill";

const MAX_STAR_LEVEL = 10;

export class Card {
    constructor(name, offensiveSkillName, defensiveSkillName, passiveSkillName, consumableSkillName, stars) {
        this.name = name;
        this.offensiveSkill = OffensiveSkills[offensiveSkillName];
        this.defensiveSkill = defensiveSkillName;
        this.passiveSkill = PassiveSkills[passiveSkillName];
        this.consumableSkill = consumableSkillName;
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
        this.passiveSkill.activate();
    }

    deactivatePassive() {
        this.passiveSkill.deactivate();
    }

    consume() {
        this.consumableSkill.use();
    }
}

export const StarterCards = Object.freeze([
    new Card("First Card", "sword", "shield", "speedBoost", "nuke", 1),
    new Card("Second Card", "bow", "sideDodge", "lifeRegenBoost", "nuke", 3),
    new Card("Third Card", "spear", "backDodge", "speedBoost", "nuke", 2),
    new Card("Fourth Card", "axe", "roll", "lifeRegenBoost", "nuke", 4),
    new Card("Fifth Card", "crossbow", "parry", "speedBoost", "nuke", 2),
    new Card("Sixth Card", "hammer", "roll", "lifeRegenBoost", "nuke", 2),
    new Card("Seventh Card", "knife", "shield", "speedBoost", "nuke", 2)
]);

export const AdditionalCards = Object.freeze([
    new Card("Eighth Card", "crossbow", "shield", "speedBoost", "nuke", 2),
    new Card("Nineth Card", "wand", "shield", "lifeRegenBoost", "nuke", 2),
    new Card("Tenth Card", "spear", "shield", "speedBoost", "nuke", 2)
]);
