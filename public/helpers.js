
import { getCurrentState } from "../assets/scripts/ECS/helpers";

export function bindToScriptEvent(component, propertyName, componentPropertyName = propertyName) {
    const state = getCurrentState();

    component[componentPropertyName] = state.getState(propertyName);

    state.on(propertyName, (newValue) => {
        component[componentPropertyName] = newValue;
        component.update();
    });
}