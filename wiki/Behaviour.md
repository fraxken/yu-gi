# Behavior

Les behaviors sont le coeur du jeu. Ce sont des scripts que nous attachons aux acteurs pour leur donner des comportements. Un acteur peut avoir plusieurs scripts attachés sur lui.

```js
// Import dependencies
import { ScriptBehavior } from "../ECS";

// Il est important d'étendre la class avec la class Abstraite 'ScriptBehavior' présente dans l'ECS!
export default class MyCustomBehavior extends ScriptBehavior {
    awake() {
        // La phase awake est déclenchée à l'éveil du script (l'acteur) dans la scène.
    }

    start() {
        // La phase start est déclenchée quand TOUTES les phases awake ont été déclenchés.
        // Cette phase permet notamment d'exploiter des acteurs et éléments qui auraient été dynamiquement générés dans la phase awake.
    }

    update() {
        // La phase update est appelée 60 fois par seconde (60 frames par seconde).
    }
}

// Permets de lier un nom à notre instance (pourra être utilisé plus tard pour la création d'un script)
ScriptBehavior.define("MyCustomBehavior", MyCustomBehavior);
```

Une fois votre script créé il vous suffira de l'utiliser comme suit sur les acteurs de votre choix:
```js
const actor1 = new Actor("actor1")
    .createScriptedBehavior("MyCustomBehavior");

const actor2 = new Actor("actor2")
    .createScriptedBehavior("MyCustomBehavior");
```

Noter qu'il est aussi possible de récupérer un script sur un acteur:
```js
const myScript = actor1.getScriptedBehavior("MyCustomBehavior");

myScript.sendMessage("methodName");
```

> Ce qui peut être pratique pour envoyer un message au script en question.

## Récupérer l'acteur dans le script

Il est possible de récupérer l'acteur (le parent du script) avec `this.actor`.

```js
awake() {
    console.log(`MyCustomBehavior: attaché à l'acteur: ${this.actor.name}`);
}
```

## Case study: DoorBehavior

```js
// Import dependencies
import { ScriptBehavior, getActor, Timer, hitTestRectangle } from "../ECS";
import { Inputs } from "../keys";

export default class DoorBehavior extends ScriptBehavior {
    awake() {
        // Nous créons un timer de 30 frames qui ne démarre pas seul et n'itère pas non plus tout seul.
        // Ce timer servira à éviter que le joueur puisse déclencher plusieurs téléportations.
        this.warpTimer = new Timer(30, { autoStart: false, keepIterating: false });
    }

    start() {
        // Nous récupérons des acteurs du jeu grâce à la méthode de l'ECS "getActor".
        // ATTENTION: si un acteur n'existe pas dans le jeu la méthode retournera null. C'est d'ailleurs pour cette raison que ces deux lignes sont présentes dans start();
        this.target = getActor("player");
        this.connectedTo = getActor(this.actor.tileProperties.connectTo); // propriété attaché par le composant TiledMap.
    }

    // Nous créons une méthode pour que le code soi plus clair et plus simple à maintenir (cela évite de tout mélanger dans update).
    warp() {
        // Démarrer le timer manuellement.
        this.warpTimer.start();

        // Nous récupérons le script de notre "target" (ici le script du joueur).
        const script = this.target.getScriptedBehavior("PlayerBehavior");

        // Nous envoyons un message avec la position de téléportation. Nous séparons la logique car ce n'est pas à la porte de téléporter le joeur mais bien le script PlayerBehavior qui doit gérer cela.
        script.sendMessage("teleport", this.connectedTo.centerPosition);
    }

    update() {
        // Si le timer est démarré mais pas encore terminé alors nous arrêtons l'update.
        if (this.warpTimer.isStarted && !this.warpTimer.walk()) {
            return;
        }

        // On vérifie si la distance entre la porte et le joueur est assez "courte" (ici au sens Vector2 <-> Vector2)
        const distance = this.actor.pos.distanceTo(this.target.pos);
        if (distance < 50 && Inputs.use()) { // Inputs.use -> E ou SPACE
            this.warp();
        }
    }
}

ScriptBehavior.define("DoorBehavior", DoorBehavior);
```

## Lié des propriétés du behavior au state du jeu.

Prenons un state défini comme suit:
```js
new State("foobar", {
    player: {
        life: 0
    }
});
```

Il nous sera possible de lier le state à nos behaviors pour mettre à jour les clés dynamiquement (et aussi permettre aux éléments du jeu de réagir aux changements de manière dynamique).

```js
// - La clé représente le nom de la propriété dans le script
// - La valeur représente la clé ou le chemin vers la clé dans le state.
const STATE_CONFIG = {
    life: "player.life"
}

export default class MyCustomBehavior extends ScriptBehavior {
    constructor() {
        super(STATE_CONFIG);

        // ATTENTION: this.life n'est pas lié au state dans le constructor
        // Si vous assignez une valeur par défaut dans le constructor, elle sera prise en compte si la valeur n'est pas créée dans le state.
    }

    update() {
        // Mets à jour la valeur dans le state automatiquement.
        this.life++;
    }
}
```
