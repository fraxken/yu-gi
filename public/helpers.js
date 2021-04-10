
export function bindToScriptEvent(propertyName, component, script) {
    component[propertyName] = script[propertyName];

    script.on(`property:${propertyName}`, (newValue) => {
        component[propertyName] = newValue;
        component.update();
    });
}