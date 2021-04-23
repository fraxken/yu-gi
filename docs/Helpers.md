# Helpers

Il y a plusieurs méthodes disponible en helpers sur l'ECS.

## getActor(actorName: string): Actor | null
Cherche et récupère (s'il existe) un acteur du jeu ou d'une scène. À noter que la function est un raccourci qui va aller recherche sur la scène principale du jeu.

```js
export function getActor(name) {
    return game.rootScene.findChild(name, true);
}
```

Il est donc aussi possible d'utiliser la méthode **findchild** sur une sous scène (voir même un Actor).

## findAsset(assetName: string)
Recherche et retourne l'asset PIXI.js. L'asset doit être nommé et existant dans le fichier `assets.json`.

## getCurrentState(): State
Retourne l'objet State du jeu.

## getTexture(assetName: string, textureName: string)
Récupérer une texture dans un asset (un ATLAS par exemple).
