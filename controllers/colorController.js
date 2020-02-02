let randomColorPackage=require('randomcolor');
let colorConvert=require('color-convert');


module.exports = {
    randomColor: () => {
        let hex = randomColorPackage();
        return module.exports.buildColorFromHex(hex);
    },
    buildColorFromHex: (inputHex) => {
        let hsl = colorConvert.hex.hsl(inputHex); 
        let rgb = colorConvert.hex.rgb(inputHex);
        let hsv = colorConvert.hex.hsv(inputHex);

        return {
            hsl: {
                h: hsl[0],
                s: hsl[1],
                l: hsl[2],
                a: 1
            },
            hex: inputHex,
            rgb: {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
                a: 1
            },
            hsv: {
                h: hsv[0],
                s: hsv[1],
                v: hsv[2],
                a: 1
            },
            oldHue: hsv[0],
            source: 'hex'
        };
    }
};

