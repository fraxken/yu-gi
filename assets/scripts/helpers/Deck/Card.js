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
    new Card("Warrior", "sword", "shield", "speed", "heal", 1),
    new Card("Archer", "bow", "shield", "speed", "heal", 3),
    new Card("Knight", "spear", "shield", "speed", "invincible", 2),
    new Card("Bandit", "axe", "dodge", "speed", "heal", 2),
    new Card("Berserker", "hammer", "dodge", "defense", "invincible", 2),
    new Card("Thief", "knife", "counter", "defense", "resistance", 3),
    new Card("Ranger", "crossbow", "dash", "defense", "resistance", 4),
    new Card("Wizard", "spell", "dash", "special", "invincible", 2),
]);
