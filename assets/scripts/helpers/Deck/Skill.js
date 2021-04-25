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
        for (let index = 0; index < this.params; ++index) {
            getActor("player").getScriptedBehavior("PlayerBehavior").sendMessage("testAction", this.name);
        }
    }
}

export class DefensiveSkill extends AbstractSkill {
    constructor(name, params) {
        super(name, params);
    }

    use() {
        // DO THINGS
    }
}

export class PassiveSkill extends AbstractSkill {
    constructor(name, params) {
        super(name, params);
    }

    activate() {
        getActor("player").getScriptedBehavior("PlayerBehavior").sendMessage("activatePassive", this.name, this.params);
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
        // DO THINGS
    }
}

export const OffensiveSkills = Object.freeze({
    sword: new OffensiveSkill("sword", 1),
    bow: new OffensiveSkill("bow", 1),
    spear: new OffensiveSkill("spear", 2),
    axe: new OffensiveSkill("axe", 1),
    crossbow: new OffensiveSkill("crossbow", 2),
    hammer: new OffensiveSkill("hammer", 1),
    knife: new OffensiveSkill("knife", 3),
    wand: new OffensiveSkill("wand", 1)
});

export const PassiveSkills = Object.freeze({
    speedBoost: new PassiveSkill("speedBoost", 3),
    lifeRegenBoost: new PassiveSkill("lifeRegenBoost", 3)
});
