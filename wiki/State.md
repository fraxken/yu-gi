# State

Le state permet de conserver et synchroniser des éléments automatiquement entre les éléments du jeu (entre les behaviors et l'interface par exemple).

Il se sauvegarde automatiquement dans le LocalStorage (ce qui permet au joueur de retrouver sa progression).

```js
const gameState = new State("state", {
    player: {
        name: "Thomas",
        currentHp: 1,
        maxHp: 15
    }
});
```

## Methods

### load()
Charge le state (appelé par défaut lors de la création).

### reset()
Nettoie le LocalStorage et réinitialise les valeurs.

### save()
Sauvegarde le state dans le LocalStorage.

### setState(key, value)
Permets d'ajouter ou mettre à jour une clé dans le state.

```js
gameState.setState("player.name", "foobar");
gameState.setState("items", [1, 2, 3]);
```

La méthode déclenchera un évènement qui peut être écouté (le nom de l'évènement est le nom/chemin de la clé).

```js
gameState.on("player.name", (newValue) => console.log(`player.name new value is: ${newValue}`));
```

### getState(key)
Récupère une clé dans le state.


## State et HUD

Le HUD possède un helper qui permet de lier le changement d'une clé avec un composant:

```js
export function bindToScriptEvent(component, propertyName, componentPropertyName = propertyName) {
    const state = getCurrentState();

    component[componentPropertyName] = state.getState(propertyName);

    state.on(propertyName, (newValue) => {
        component[componentPropertyName] = newValue;
        component.update();
    });
}
```

```js
class SimpleGreeting extends LitElement {
    constructor() {
        super();
        bindToScriptEvent(this, "player.currentHp", "hp");
        bindToScriptEvent(this, "player.name", "name");
    }

    render() {
        return html`
            <div class="menu-player">
                <h2>${this.name}!</h2>
                <p>Player life: ${this.hp}!</p>
            </div>
        `;
    }
}
```
