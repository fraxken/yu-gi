export function linearTween(t, b, c, d) {
    return ((c * t) / d) + b;
}

export function easeInQuad(t, b, c, d) {
    return ((c * (t /= d)) * t) + b;
}

export function easeOutQuad(t, b, c, d) {
    return ((-c * ( t /= d)) * (t - 2)) + b;
}

export function easeInOutQuad(t, b, c, d) {
    t /= (d / 2);

    if (t < 1) {
        return (((c / 2) * t) * t) + b;
    }

    t--;

    return ((-c / 2) * (t*(t-2) - 1)) + b;
};

export function easeInCubic(t, b, c, d) {
    return (c * Math.pow((t / d), 3)) + b;
}

export function easeOutCubic(t, b, c, d) {
    return (c * (Math.pow((t / d) - 1, 3) + 1)) + b;
}

export function easeInOutCubic(t, b, c, d) {
    if ((t /= (d / 2)) < 1) {
        return ((c / 2) * Math.pow(t, 3)) + b;
    }

    return ((c / 2) * (Math.pow((t - 2), 3) + 2)) + b;
}

export function easeInQuart(t, b, c, d) {
    return (c * Math.pow((t / d), 4)) + b;
}

export function easeOutQuart(t, b, c, d) {
    return (-c * (Math.pow(((t / d) - 1), 4) - 1)) + b;
}

export function easeInOutQuart(t, b, c, d) {
    if ((t /= (d / 2)) < 1) {
        return ((c / 2) * Math.pow(t, 4)) + b;
    }

    return ((-c / 2) * (Math.pow((t - 2), 4) - 2)) + b;
}

export function easeInQuint(t, b, c, d) {
    return (c * Math.pow((t / d), 5)) + b;
}

export function easeOutQuint(t, b, c, d) {
    return (c * (Math.pow(((t / d) - 1), 5) + 1)) + b;
}

export function easeInOutQuint(t, b, c, d) {
    if ((t /= (d / 2)) < 1) {
        return ((c / 2) * Math.pow(t, 5)) + b;
    }

    return ((c / 2) * (Math.pow((t - 2), 5) + 2)) + b;
}

export function easeInSine(t, b, c, d) {
    return (c *(1 - Math.cos((t / d) * (Math.PI / 2)))) + b;
}

export function easeOutSine(t, b, c, d) {
    return (c * Math.sin(((t / d) * (Math.PI / 2)))) + b;
}

export function easeInOutSine(t, b, c, d) {
    return ((c / 2) * (1 - Math.cos(Math.PI * (t / d)))) + b;
}

export function easeInExpo(t, b, c, d) {
    return (c * Math.pow(2, (10 * ((t / d) - 1)))) + b;
}

export function easeOutExpo(t, b, c, d) {
    return (c * (-Math.pow(2, ((-10 * (t / d)) + 1)))) + b;
}

export function easeInOutExpo(t, b, c, d) {
    if (( t /= (d / 2)) < 1) {
        return ((c / 2) * Math.pow(2, (10 * (t - 1)))) + b;
    }

    return ((c / 2) * (-Math.pow(2, (-10 * --t)) + 2)) + b;
}

export function easeInCirc(t, b, c, d) {
    return (c * (1 - Math.sqrt((1 - ((t /= d) * t))))) + b;
}

export function easeOutCirc(t, b, c, d) {
    return (c * Math.sqrt(1 - (((t = t / d) - 1) * t))) + b;
}

export function easeInOutCirc(t, b, c, d) {
    if ((t /= (d / 2)) < 1) {
        return ((c / 2) * (1 - Math.sqrt((1 - (t * t))))) + b;
    }

    return ((c / 2) * (Math.sqrt(1 - ((t -= 2) * t)) + 1)) + b;
}

export function easeOutBounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return (c * ((7.5625 * t) * t)) + b;
    }
    else if (t < (2 / 2.75)) {
        return (c * ((7.5625 * (t -= (1.5 / 2.75)) * t) + 0.75)) + b;
    }
    else if (t < (2.5 / 2.75)) {
        return (c * ((7.5625 * (t -= (2.25 / 2.75)) * t) + 0.9375)) + b;
    }

    return (c * (7.5625 * ((t -= (2.625 / 2.75)) * t) + 0.984375)) + b;
}

export function easeInBounce(t, b, c, d) {
    return (c - easeOutBounce((d - t), 0, c, d)) + b;
}

export function easeInOutBounce(t, b, c, d) {
    if (t < (d / 2)) {
        return (easeInBounce((t * 2), 0, c, d) * 0.5) + b;
    }

    return ((easeOutBounce(((t * 2) - d), 0, c, d) * 0.5) + (c * 0.5)) + b;
}

export function easeInBack(t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }

    return (((c * (t /= d)) * t) * (((s + 1) * t) - s)) + b;
}

export function easeOutBack(t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }

    return c * ((t = (t / d) - 1) * t * ((s + 1) * t + s) + 1) + b;
}

export function easeInOutBack(t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }

    if ((t /= (d / 2)) < 1) {
        return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    }

    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}

export function easeInElastic(t, b, c, d, a, p) {
    if (t === 0) {
        return b;
    }

    if ((t /= d) === 1) {
        return b + c;
    }

    if (!p) {
        p = d * .3;
    }

    if (a < Math.abs(c)) {
        a = c;
        const s = p / 4;
    }
    else {
        const s = p / (2 * Math.PI) * Math.asin (c / a);
    }

    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
};

export function easeOutElastic(t, b, c, d, a, p) {
    if (t === 0) {
        return b;
    }

    if ((t /= d) === 1) {
        return b + c;
    }

    if (!p) {
        p = d * .3;
    }

    if (a < Math.abs(c)) {
        a = c;
        const s = p / 4;
    }
    else {
        const s = p / (2 * Math.PI) * Math.asin (c / a);
    }

    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
};

export function easeInOutElastic(t, b, c, d, a, p) {
    if (t === 0) {
        return b;
    }

    if ((t /= d / 2) === 2) {
        return b + c;
    }

    if (!p) {
        p = d * (.3 * 1.5);
    }

    if (a < Math.abs(c)) {
        a = c;
        const s = p / 4;
    }
    else {
        const s = p / (2 * Math.PI) * Math.asin(c / a);
    }

    if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d-s) * (2 * Math.PI) / p)) + b;
    }

    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) *.5 + c + b;
};
