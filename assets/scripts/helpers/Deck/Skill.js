import { getActor } from "../../ECS";

export class AbstractSkill {
    constructor(name, params, description = "") {
        this.name = name;
        this.params = params;
        this.description = description;
    }
}

export class OffensiveSkill extends AbstractSkill {
    constructor(name, params) {
        super(name, params);
    }

    use() {
        getActor("player").getScriptedBehavior("PlayerBehavior").sendMessage("offensiveSkill", this.name);
    }
}

export class DefensiveSkill extends AbstractSkill {
    constructor(name, params) {
        super(name, params);
    }

    use() {
        getActor("player").getScriptedBehavior("PlayerBehavior").sendMessage("defensiveSkill", this.name);
    }
}

export class PassiveSkill extends AbstractSkill {
    constructor(name, params) {
        super(name, params);
    }

    activate(stars) {
        getActor("player").getScriptedBehavior("PlayerBehavior").sendMessage("activatePassive", this.name, this.params * stars);
    }

    deactivate() {
        getActor("player").getScriptedBehavior("PlayerBehavior").sendMessage("deactivatePassive", this.name);
    }
}

export class ConsumableSkill extends AbstractSkill {
    constructor(name, params) {
        super(name, params);
    }

    use() {
        getActor("player").getScriptedBehavior("PlayerBehavior").sendMessage("consumable", this.name, this.params);
    }
}

export const OffensiveSkills = Object.freeze({
    sword: new OffensiveSkill("sword", 1),
    axe: new OffensiveSkill("axe", 1),
    hammer: new OffensiveSkill("hammer", 1),
    claw: new OffensiveSkill("claw", 1),
    spear: new OffensiveSkill("spear", 2),
    whip: new OffensiveSkill("whip", 2),
    bow: new OffensiveSkill("bow", 1),
    crossbow: new OffensiveSkill("crossbow", 2),
    knife: new OffensiveSkill("knife", 2),
    pistol: new OffensiveSkill("pistol", 2),
    riffle: new OffensiveSkill("riffle", 2),
    spell: new OffensiveSkill("spell", 1)
});

export const DefensiveSkills = Object.freeze({
    shield: new DefensiveSkill("shield", 1),
    dodge: new DefensiveSkill("dodge", 1),
    counter: new DefensiveSkill("counter", 1),
    dash: new DefensiveSkill("dash", 1),
});

export const PassiveSkills = Object.freeze({
    attack: new PassiveSkill("attack", 1),
    defense: new PassiveSkill("defense", 1),
    special: new PassiveSkill("special", 1),
    speed: new PassiveSkill("speed", 1),
    healthRegenBoost: new PassiveSkill("healthRegenBoost", 1)
});

export const ConsumableSkills = Object.freeze({
    heal: new ConsumableSkill("heal", 4),
    portal: new ConsumableSkill("portal", 1),
    nuke: new ConsumableSkill("nuke", 1),
    invincible: new ConsumableSkill("invincible", 1),
    resistance: new ConsumableSkill("resistance", 1),
    secretVision: new ConsumableSkill("secretVision", 1)
});
