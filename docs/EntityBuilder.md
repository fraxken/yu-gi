# Entity Builder

L'entity Builder n'est rien de plus qu'un registre statique qui fonctionne à l'aide de clé. Il permet de simplifier la création d'élement dans le jeu (sans avoir la nécessité d'importer tout un tas de trucs).

```js
EntityBuilder.define("actor:projectile", (options = {}) => {
    return new Actor(EntityBuilder.increment("projectile"))
        .createScriptedBehavior(new ProjectileBehavior(options));
});
```

Par exemple ici nous définissons une méthode qui s'occupera de créer un acteur avec un nom qui s'incrémentera tout seul (et avec le bon script).

Nous pourrons par la suite créer un ou plusieurs projectiles:

```js
EntityBuilder.create("actor:projectile");
EntityBuilder.createMany("actor:projectile", 10);
```

Il est aussi possible de récupérer les noms du registre par pattern:
```js
for (const key of EntityBuilder.getKeys(/^actor/)) {
    console.log(key);
}
```
