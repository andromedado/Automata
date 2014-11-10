function randomInt(max, min) {
    if (typeof min === 'undefined') min = 0;
    return Math.floor(Math.random() * (max - min)) + min;
}

function avgColors (colors, mutationFactor) {
    var rgb = {
        r : 0,
        g : 0,
        b : 0
    };
    _.each(colors, function (hex){
        var localRgb = hexToRgb(hex);
        rgb.r += localRgb.r;
        rgb.g += localRgb.g;
        rgb.b += localRgb.b;
    });
    rgb.r /= colors.length;
    rgb.g /= colors.length;
    rgb.b /= colors.length;

    if (mutationFactor) {
        rgb.r = (rgb.r + (255 * mutationFactor * Math.random())) / 2;
        rgb.g = (rgb.g + (255 * mutationFactor * Math.random())) / 2;
        rgb.b = (rgb.b + (255 * mutationFactor * Math.random())) / 2;
    }

    rgb.hex = rgbToHex(rgb);
    return rgb;
}

function rgbToHex (color) {
    color.r = Math.round(color.r).toString(16);
    if (color.r.length < 2) {
        color.r = '0' + color.r;
    }
    color.g = Math.round(color.g).toString(16);
    if (color.g.length < 2) {
        color.g = '0' + color.g;
    }
    color.b = Math.round(color.b).toString(16);
    if (color.b.length < 2) {
        color.b = '0' + color.b;
    }
    return'#' + color.r + color.g + color.b;
};

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var utils = {
    hsvToHex : function hsvToHex (h, s, v) {
        var color = HSVtoRGB(h, s, v);
        color.r = Math.round(color.r * 255).toString(16);
        if (color.r.length < 2) {
            color.r = '0' + color.r;
        }
        color.g = Math.round(color.g * 255).toString(16);
        if (color.g.length < 2) {
            color.g = '0' + color.g;
        }
        color.b = Math.round(color.b * 255).toString(16);
        if (color.b.length < 2) {
            color.b = '0' + color.b;
        }
        return'#' + color.r + color.g + color.b;
    },
    mkRandomFn : function (ini) {
        var seed = 0, l;
        ini = String(ini || Math.random());
        l = ini.length;
        for (var i = 0; i < l; i++) {
            seed += Math.tan(ini.charCodeAt(i) + seed);
        }
        return function () {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    },
    combineEntropy : function (a, b, n) {
        n = n || 1.0;
        return (a + b) % n;
    }
};

function HSVtoRGB (h, s, v) {
    var i, f, p, q, t, color = {r: 0, g: 0, b: 0};
    if (s == 0) {
        color.r = color.g = color.b = v;
        return color;
    }
    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    switch (i) {
        case 0:
            color.r = v;
            color.g = t;
            color.b = p;
            break;
        case 1:
            color.r = q;
            color.g = v;
            color.b = p;
            break;
        case 2:
            color.r = p;
            color.g = v;
            color.b = t;
            break;
        case 3:
            color.r = p;
            color.g = q;
            color.b = v;
            break;
        case 4:
            color.r = t;
            color.g = p;
            color.b = v;
            break;
        default:
            color.r = v;
            color.g = p;
            color.b = q;
            break;
    }
    return color;
}


