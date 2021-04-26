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
    shieldParry: new DefensiveSkill("shieldParry", 1),
    shieldDefense: new DefensiveSkill("shieldDefense", 1),
    dodge: new DefensiveSkill("dodge", 1),
    counter: new DefensiveSkill("counter", 1),
    dash: new DefensiveSkill("dash", 1),
});

export const PassiveSkills = Object.freeze({
    attackDamageBoost: new PassiveSkill("attackDamageBoost", 1),
    defenseBoost: new PassiveSkill("defenseBoost", 1),
    elementaryDamage: new PassiveSkill("elementaryDamage", 1),
    speedBoost: new PassiveSkill("speedBoost", 3),
    healthRegenBoost: new PassiveSkill("healthRegenBoost", 3),
    attackRangeBoost: new PassiveSkill("attackRangeBoost", 1),
});

export const ConsumableSkills = Object.freeze({
    healthUp: new ConsumableSkill("healthUp", 4),
    portal: new ConsumableSkill("portal", 1),
    nuke: new ConsumableSkill("nuke", 1),
    singleTargetSpecial: new ConsumableSkill("singleTargetSpecial", 1),
    multiTargetSpecial: new ConsumableSkill("multiTargetSpecial", 1),
    invincible: new ConsumableSkill("invincible", 1),
    elementaryImmunity: new ConsumableSkill("elementaryImmunity", 1),
    discardToChest: new ConsumableSkill("discardToChest", 1),
    deckToChest: new ConsumableSkill("deckToChest", 1),
    secretVision: new ConsumableSkill("secretVision", 1)
});
