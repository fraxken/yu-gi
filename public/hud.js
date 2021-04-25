import "./components/simple-greeting.js";
import "./components/player-hp.js";
import "./components/positioning-grid.js";
import "./components/action-bar/action-bar-slot-card.js";
import "./components/action-bar/action-card.js";
import "./components/action-bar/refresh-action-card.js";
import "./components/action-bar/action-button.js";
import "./components/keyboard-icon/keyboard-icon.js";
import "./components/action-keys/action-keys.js";
import "./components/action-keys/move-keys.js";
import "./components/action-keys/action-key.js"

// MODALS
import "./components/modals/manager.js";

function newInputType(newType) {
    console.log("new input usage: ", newType);
}

function triggerModal(open, modelName) {
    const modalManager = document.getElementById("modal-manager");

    modalManager.innerHTML = "";
    if (open) {
        const component = document.createElement(modelName);
        component.setAttribute("slot", "modal");
        modalManager.appendChild(component);
        modalManager.style.display = "block";
    }
    else {
        modalManager.style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("[INFO] DOM loaded");
    const hud = document.querySelector(".hud");
    const hudevents = window.hudevents;
    window.currentActiveHUD = null;

    function loadHUD(name) {
        if (window.currentActiveHUD === name) {
            return;
        }

        hudevents.removeAllListeners();
        hudevents.on("input_type", newInputType);
        hudevents.on("minimap", (open) => triggerModal(open, "mini-map"));

        const elementName = `#${name}`;
        const template = document.querySelector(elementName);
        if (!template) {
            throw new Error(`[ERROR] Unable to found HTML Template with name '${elementName}'`);
        }

        const clone = document.importNode(template.content, true);
        hud.innerHTML = "";
        hud.appendChild(clone);
        window.currentActiveHUD = name;

        console.log(`[INFO] hud '${elementName}' loaded!`)
    }
    window.loadHUD = loadHUD;
});

window.document.addEventListener('contextmenu', event => event.preventDefault());
