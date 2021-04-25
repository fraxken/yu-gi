

const MAX_STAR_LEVEL = 10;

export class Card {
    constructor(name, offensiveSkill, defensiveSkill, passiveSkill, consumableSkill, stars) {
        this.name = name;
        this.offensiveSkill = offensiveSkill;
        this.defensiveSkill = defensiveSkill;
        this.passiveSkill = passiveSkill;
        this.consumableSkill = consumableSkill;
        this.stars = stars;
    }

    upgrade() {
        if (this.stars < 10) { ++this.stars; }
        else { console.log("ALREADY AT LEVEL MAX") }
    }
}
