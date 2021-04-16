// Import third-party dependencies
import { Sound, sound } from "@pixi/sound";

// Import internal dependencies
import { Easing, Actor, Vector2 } from "../ECS";

function rad(degress) {
    return degress * (Math.PI / 180);
}

function deg(radians) {
    return radians * (180 / Math.PI);
}

export default class SpatialSound {
    /**
     * @param {!string} assetName path of asset in Sound type
     * @param {!Actor} gameObject ECS Actor - sound position follow his position
     * @param {!Actor} listener l'objet qui sers de reference pour gerer le volume.
     * @param {object} options
     * @param {number} [options.max=100]
     * @param {number} [options.min=3]
     * @param {number} [options.maxsound=1] real between 0 and 1 (sound perception is logarithmic)
     * @param {boolean} [options.loop=false]
     * @param {boolean} [options.static=true]
     * @param {number} [options.panBalancer=100]
     * @param {keyof Easing} [options.easing="linearTween"]
     * @param {boolean} [options.debug=false]
     */
    constructor(assetName, gameObject, listener, options = {}) {
        this.gameObject = gameObject;
        this.listener = listener;
        this.loop = options.loop || false;
        this.maxsound = options.maxsound || 1;
        this.max = options.max || 100;
        this.min = options.min || 3;
        this.static = options.static || true;
        this.panBalancer = options.panBalancer || 100;
        this.easing = options.easing || "linearTween";
        this.debug = options.debug || false;

        // Note: create a circle graphic to debug
        if (this.debug) {
            this.createCircleGraphic();
        }

        /** @type {Sound} */
        this.sound = sound.find(assetName);

        // @see https://pixijs.io/sound/docs/Sound.html (context & instances)
        /** @type {AudioContext} */
        this.audioCtx = this.sound.context;

        // @see https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode
        this.panNode = this.audioCtx.createStereoPanner();
        for (const source of this.sound.instances) {
            source.connect(this.panNode);
        }
        this.panNode.connect(this.audioCtx.destination);

        this.sound.volume = this.maxsound;
        this.sound.loop = this.loop;
        this.sound.play();

        this.pos = this.gameObject.pos;
    }

    createCircleGraphic() {

    }

    check() {
        const distance = this.pos.distanceTo(this.listener.pos);

        if (distance < this.max && distance > 0) {
            if (distance < this.min) {
                this.sound.volume = this.maxsound;
            }
            else {
                const factor = Easing[this.easing](distance - this.min, 0, 1, this.max - this.min);
                this.sound.volume = factor * this.maxsound;
            }

            const listenerOrient = rad(this.listener.angle);
            const listenerDirection = new Vector2(Math.sin(listenerOrient), Math.cos(listenerOrient));
            const normalizedListenerDirection = listenerDirection.clone().normalize();

            const soundDirection = this.listener.pos.clone().sub(this.pos);
            soundDirection.y = 0;

            /** @type {number} */
            let pan = null;
            {
                // -- Produit scalaire : formule pour avoir un angle avec 2 vecteurs : cos(angle) = (O->A * O->B) / (OA * OB) et le resultat sera toujours positif entre 0 et 180
                // -- O->A * O->B = Vector2.Dot(A,B)   --   Dot = produit scalaire
                // -- OA = Vector2:Length()
                const dotProduct = normalizedListenerDirection.dot(soundDirection);
                const lengthProd = normalizedListenerDirection.length() * soundDirection.length;

                const resultAngle = deg(Math.acos(dotProduct / lengthProd));
                pan = resultAngle > 90 ?
                    (90 - (resultAngle % 90)) / this.panBalancer :
                    resultAngle / this.panBalancer;
            }

            // -- On utilise la formule du déterminent d'une matrice 2*2 (X,Z) pour savoir si le son est à notre droite ou à notre gauche en fonction de notre orientation
            // -- deter de la matrice 2x2 M : |a  b| -- a b = 1er vecteur 2D -- c d = 2em vecteur 2D
            // --                             |c  d| = a*d - b*c
            // -- le vecteur ab sera représenté sous forme d'une droite et le vecteur cd sous forme d'un point donc
            // -- vue que le vecteur ad est notre direction d'orientation et le vecteur cd notre point qui représente l'emplacement du son
            // -- nous allons pouvoir savoir si le son est a droite ou a gauche de la droite
            const determinent = listenerDirection.x * soundDirection.y - listenerDirection.y * soundDirection.x;

            // -- si le résultat est positif alors le point est à gauche de la droite
            // -- si le résultat est négatif alors le point est à droite de la droite
            // -- si le résultat est nul alors le point est sur la droite
            this.panNode.pan.setValueAtTime(determinent >= 0 ? pan : -pan, this.audioCtx.currentTime);
        }
        else {
            this.sound.volume = 0;
        }

        if (!this.static) {
            this.move();
        }
    }

    move() {
        this.pos = this.gameObject.pos;
    }
}
