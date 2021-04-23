# Actor

La class Actor est une extension de **PIXI.Container**. L'acteur est par essence un élément (un point) dans le jeu (le monde). Un acteur possède un nom qui est de préférence unique pour pouvoir être recherché plus tard.

Un acteur peut posséder:
- Des acteurs enfants.
- Des composants (PIXI.Sprite, PIXI.AnimatedSprite, AnimatedSpriteEx, TiledMap).
- Des scripts (behaviors).

## Gestion des mouvements et de la vélocité
Par défaut un acteur possède un ensemble de méthodes pour nous simplifier la vie.

```js
console.log(actor.moving); // false ou true (tout dépend de si l'acteur était en mouvement la frame précédente).

// Bouger l'acteur sur les coordonnées X et Y
actor.moveX(-1);
actor.moveY(1);

console.log(actor.moving); // true

// Important: sinon les mouvements ne seront pas appliqués
actor.applyVelocity();
```

## Gestion de la position
Plusieurs méthodes ont été ajoutés pour permettre de mieux travailler avec les positions.

```js
const vec2 = actor.pos; // retourne la position avec la class Vector2

// Pos est un getter/setter (fonctionne aussi avec un ObservablePoint).
actor.pos = new Vector2(10, 10);

console.log(actor.centerPosition); // La position Vector2 du centre de l'objet (si le pivot est en haut à gauche)
```

## Methods

### cleanup()
Permets de supprimer l'acteur ainsi que tous ces enfants (scripts, composants etc).

### addComponent(component)
Ajout d'un component sur l'acteur. La valeur de retour est le composant lui-même.

```js
const spriteComponent = new Components.AnimatedSpriteEx("adventurer", {
    defaultAnimation: "adventurer-idle"
});

actor.addComponent(spriteComponent);
```

En fonction de la nature du composant il sera disponible directement sur l'actor!

```js
console.log(actor.sprite); // PIXI.Sprite, PIXI.AnimatedSprite, AnimatedSpriteEx
console.log(actor.map); // TiledMap
```

### getComponent(type)
Permets de récupérer un composant par son type (les types sont disponibles par le biais de Components.Types dans l'ECS).

```js
this.collision = map.getComponent(Components.Types.TiledMap).collision;
```
