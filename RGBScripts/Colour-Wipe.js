/*

Initially all pixeles are set to color 1.
Via a Column/Row Fill each pixel is changed to Color 2
Via a Column/Row Fill each pixel is changed back to Color 1


*/

// Development tool access
var testAlgo;

(

    function() {
        var algo = new Object;
        algo.apiVersion = 2;
        algo.name = "Colour Wipe";
        algo.author = "Rick McGuire";
        algo.acceptColors = 1; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
        algo.properties = [];
        //algo.WipeDirection = "Left-To-Right";
        algo.WipeDirection = "Right-To-Left";
        algo.properties.push("name:WipeDirection|type:list|display:WipeDirection|values:Left-To-Right,Right-To-Left|write:setWipeDirection|read:getWipeDirection");
        algo.WipeMode = "Diagonal";
        algo.properties.push("name:WipeMode|type:list|display:WipeMode|values:Horizontal,Vertical,Diagonal,Square|write:setWipeMode|read:getWipeMode");
        algo.Colour_1_Red = 255;
        algo.properties.push("name:Colour_1_Red|type:range|display:Colour_1_Red|values:0,255|write:setColour_1_Red|read:getColour_1_Red");
        algo.Colour_1_Green = 0;
        algo.properties.push("name:Colour_1_Green|type:range|display:Colour_1_Green|values:0,255|write:setColour_1_Green|read:getColour_1_Green");
        algo.Colour_1_Blue = 0;
        algo.properties.push("name:Colour_1_Blue|type:range|display:Colour_1_Blue|values:0,255|write:setColour_1_Blue|read:getColour_1_Blue");
        algo.Colour_2_Red = 0;
        algo.properties.push("name:Colour_2_Red|type:range|display:Colour_2_Red|values:0,255|write:setColour_2_Red|read:getColour_2_Red");
        algo.Colour_2_Green = 0;
        algo.properties.push("name:Colour_2_Green|type:range|display:Colour_2_Green|values:0,255|write:setColour_2_Green|read:getColour_2_Green");
        algo.Colour_2_Blue = 255;
        algo.properties.push("name:Colour_2_Blue|type:range|display:Colour_2_Blue|values:0,255|write:setColour_2_Blue|read:getColour_2_Blue");

        var util = {}; //holder object for algorithm data
        var Colour = [];
        var C1 = 0; // Qrgb  for first Colour
        var C2 = 0; // Qrgb  for first Colour

        /**
         * Custom Property Getter and Setter methods
         * Sets the mode the gradient is calculated over.
         */
        algo.setWipeDirection = function(_WipeDirectionValue) {
            algo.WipeDirection = _WipeDirectionValue;
        };

        algo.getWipeDirection = function() {
            return algo.WipeDirection;
        };

        /**
         * Custom Property - WipeMode
         * The direction the ser color will move.
         */

        algo.setWipeMode = function(_WipeModeValue) {
            algo.WipeMode = _WipeModeValue;
        };

        algo.getWipeMode = function() {
            return algo.WipeMode;
        };

        /**
         * Custom Property Getter and Setter methods
         */
        algo.setColour_1_Red = function(_Colour_1_RedValue) {
            algo.Colour_1_Red = Math.floor(_Colour_1_RedValue);
            algo.initialized = false;
        };

        algo.getColour_1_Red = function() {
            return algo.Colour_1_Red;
        };

        algo.setColour_1_Green = function(_Colour_1_GreenValue) {
            algo.Colour_1_Green = Math.floor(_Colour_1_GreenValue);
            algo.initialized = false;
        };

        algo.getColour_1_Green = function() {
            return algo.Colour_1_Green;
        };

        algo.setColour_1_Blue = function(_Colour_1_BlueValue) {
            algo.Colour_1_Blue = Math.floor(_Colour_1_BlueValue);
            algo.initialized = false;
        };

        algo.getColour_1_Blue = function() {
            return algo.Colour_1_Blue;
        };

        algo.setColour_2_Red = function(_Colour_2_RedValue) {
            algo.Colour_2_Red = Math.floor(_Colour_2_RedValue);
            algo.initialized = false;
        };

        algo.getColour_2_Red = function() {
            return algo.Colour_2_Red;
        };

        algo.setColour_2_Green = function(_Colour_2_GreenValue) {
            algo.Colour_2_Green = Math.floor(_Colour_2_GreenValue);
            algo.initialized = false;
        };

        algo.getColour_2_Green = function() {
            return algo.Colour_2_Green;
        };

        algo.setColour_2_Blue = function(_Colour_2_BlueValue) {
            algo.Colour_2_Blue = Math.floor(_Colour_2_BlueValue);
            algo.initialized = false;
        };

        algo.getColour_2_Blue = function() {
            return algo.Colour_2_Blue;
        };

        algo.initialized = false;

        // initialize the stars and load random positions
        util.initialize = function(width, height) {
            C1 = RGBToQRgb(algo.Colour_1_Red, algo.Colour_1_Green, algo.Colour_1_Blue);
            C2 = RGBToQRgb(algo.Colour_2_Red, algo.Colour_2_Green, algo.Colour_2_Blue);
            algo.initialized = true;
            return;
        };

        /**
         * The actual "algorithm" for this RGB script. Produces a map of
         * size($width, $height) each time it is called.
         *
         * @param step The step number that is requested (0 to (algo.rgbMapStepCount - 1))
         * @param rgb Tells the color requested by user in the UI.
         * @return A two-dimensional array[height][width].
         */
        algo.rgbMap = function(width, height, rgb, step) {

            if (algo.initialized === false) {
                util.initialize(width, height);
            }

            var map;

            switch (algo.WipeDirection) {
                case "Left-To-Right":
                    map = util.getWipeLeftToRight(width, height, step);
                    break;
                case "Right-To-Left":
                    map = util.getWipeRightToLeft(width, height, step);
                    break;
                default:
            }

            return map;
        };

        /**
         * Tells RGB Matrix how many steps this algorithm produces with size($width, $height)
         *
         * @param width The width of the map
         * @param height The height of the map
         * @return Number of steps required for a map of size($width, $height)
         */
        algo.rgbMapStepCount = function(width, height) {
            // All pixels in the map must be used exactly once, each one separately
            // at a time. Therefore, the maximum number of steps produced by this
            // script on a 5 * 5 grid is 25.
            switch (algo.WipeMode) {
                case "Horizontal":
                    return width * 2;
                case "Vertical":
                    return height * 2;
                case "Diagonal":
                    return (1.0 * width + 1.0 * height) * 2 - 2;
                case "Square":
                    return Math.max(width, height) * 2;
            }

            return null;
        };

        /**
         * =========================================
         * Wipe Functions
         * =========================================
         */

        /**
         * Wipe Left to Right
         * @param steps - the number of steps to take
         * @returns an array of QRgb values
         */
        util.getWipeLeftToRight = function(width, height, step) {

            //Set Base and Fill Colours
            var base = C1;
            var fill = C2;

            //flip colors if over halfway
            if (step >= width && algo.WipeMode == "Horizontal") {
                base = C2;
                fill = C1;
            }

            if (step >= height && algo.WipeMode == "Vertical") {
                base = C2;
                fill = C1;
            }

            if (step >= width && step >= height && algo.WipeMode == "Square") {
                base = C2;
                fill = C1;
            }

            var map = new Array(height);

            for (var y = 0; y < height; y++) {
                map[y] = [];
                for (var x = 0; x < width; x++) {
                    map[y][x] = base; //Set to base color regardless
                    switch (algo.WipeMode) {
                        case "Horizontal":
                            if (x < (step % width)) {
                                map[y][x] = fill; //override base color
                            }
                            break;
                        case "Vertical":
                            if (y < (step % height)) {
                                map[y][x] = fill; //override base color
                            }
                            break;
                        case "Diagonal":
                            if (step < (width + height - 1)) { //Filling C2
                                if (x + y < step) {
                                    map[y][x] = C2;
                                } else {
                                    map[y][x] = C1;
                                }
                            } else { //Filling with C1
                                if (x + y < step % (width + height - 1)) {
                                    map[y][x] = C1;
                                } else {
                                    map[y][x] = C2;
                                }
                            }
                            break;
                        case "Square":
                            if (x < (step % Math.max(width, height))) {
                                if (y < (step % Math.max(width, height))) {
                                    map[y][x] = fill; //override base color
                                }
                            }
                            break;
                    }
                }
            }
            return map;
        };

        /**
         * Wipe Left to Right
         * @param steps - the number of steps to take
         * @returns an array of QRgb values
         */
        util.getWipeRightToLeft = function(width, height, step) {

            //Set Base and Fill Colours
            var base = C1;
            var fill = C2;

            //flip colors if over halfway
            if (step >= width && algo.WipeMode == "Horizontal") {
                base = C2;
                fill = C1;
            }

            if (step >= height && algo.WipeMode == "Vertical") {
                base = C2;
                fill = C1;
            }

            if (step >= width && step >= height && algo.WipeMode == "Square") {
                base = C2;
                fill = C1;
            }

            var map = new Array(height);

            for (var y = 0; y < height; y++) {
                map[y] = [];
                for (var x = 0; x < width; x++) {
                    map[y][x] = base; //Set to base color regardless
                    switch (algo.WipeMode) {
                        case "Horizontal":
                            if (x >= (width - (step % width))) {
                                map[y][x] = fill; //override base color
                            }
                            break;
                        case "Vertical":
                            if (y >= (height - (step % height))) {
                                map[y][x] = fill; //override base color
                            }
                            break;
                        case "Diagonal":
                            if (step < (width + height - 1)) { //Filling C2
                                //if ((width - x-1) + (height - y-1) < step) {
                                if ((width - x-1) + (y) < step) {
                                    map[y][x] = C2;
                                } else {
                                    map[y][x] = C1;
                                }
                            } else { //Filling with C1
                                //if ((width - x-1) + (height - y-1)  < step % (width + height - 1)) {
                                if ((width - x-1) + (y)  < step % (width + height - 1)) {
                                    map[y][x] = C1;
                                } else {
                                    map[y][x] = C2;
                                }
                            }
                            break;
                        case "Square":
                            if (x >= (width - (step % Math.max(width, height)))) {
                                if (y >= (height - (step % Math.max(width, height)))) {
                                    map[y][x] = fill; //override base color
                                }
                            }
                            break;
                    }
                }
            }
            return map;
        };


        // Development tool access
        testAlgo = algo;

        return algo;
    }
)();

/**
 * =========================================
 * Color Functions
 * =========================================
 */

//----------------- RGB TO -----------------

/**
 * Color RGBToQRgb
 * @param r - the amount of Red 0-255
 * @param g - the amount of Green 0-255
 * @param b - the amount of Blue 0-255
 * @returns a QRgb value for the color
 */
function RGBToQRgb(r, g, b) {
    return (r << 16) + (g << 8) + (b << 0);
}

/**
 * Color RGBToHue
 * @param r - the amount of Red 0-255
 * @param g - the amount of Green 0-255
 * @param b - the amount of Blue 0-255
 * @returns an Object Containing {H,S,V} for the color
 */
function RGBToHSV(r, g, b) {
    //Values to return
    var H, S, V;

    var rp = r / 255.0;
    var gp = g / 255.0;
    var bp = b / 255.0;
    var cmax = Math.max(rp, Math.max(gp, bp));
    var cmin = Math.min(rp, Math.min(gp, bp));
    var delta = cmax - cmin;
    var hue; // the hue placeholder

    //Calculate Hue
    if (delta === 0) {
        hue = 0;
    } else if (rp == cmax) {
        hue = 60 * ((gp - bp) / delta);
    } else if (gp == cmax) {
        hue = 60 * ((bp - rp) / delta + 2);
    } else { // bp == cmax
        hue = 60 * ((rp - gp) / delta + 4);
    }

    H = ((hue + 360) % 360); //Hue value to return

    //Calculate Saturation
    if (cmax === 0) {
        S = 0;
    } else {
        S = delta / cmax;
    }

    //Calcuate Value
    V = cmax;

    return {
        H: H,
        S: S,
        V: V
    };
}

//----------------- QRgb TO -----------------

/**
 * Color QRgbToRGB
 * @param QRgb - the QRgb representing the color
 * @returns an Object containing {Red, Green, Blue} for the color
 */
function QRgbToRGB(QRgb) {
    // remove alpha chanel
    QRgb = QRgb & 0x00ffffff;
    // input validation
    if (QRgb > 0xFFFFFF) {
        QRgb = 0x65CA7B;
    }
    if (QRgb < 0) {
        QRgb = 0;
    }
    return {
        Red: Math.round(((QRgb >> 16) & 0x00FF)),
        Green: Math.round(((QRgb >> 8) & 0x00FF)),
        Blue: Math.round((QRgb & 0x00FF))
    };
}

/**
 * Color QRgbToHSV
 * @param QRgb - the QRgb representing the color
 * @returns an Object Containing {H,S,V} for the color
 */
function QRgbToHSV(QRgb) {
    // remove alpha chanel
    QRgb = QRgb & 0x00ffffff;
    //input validation
    if (QRgb > 0xFFFFFF) {
        QRgb = 0x6FDE7B; //Error Code 111 222 123
    }
    if (QRgb < 0) {
        QRgb = 0;
    }

    //Values to return
    var H, S, V;
    var rp = Math.round((QRgb >> 16) & 0x00FF) / 255.0;
    var gp = Math.round((QRgb >> 8) & 0x00FF) / 255.0;
    var bp = Math.round(QRgb & 0x00FF) / 255.0;
    var cmax = Math.max(rp, Math.max(gp, bp));
    var cmin = Math.min(rp, Math.min(gp, bp));
    var delta = cmax - cmin;
    var hue; // the hue placeholder

    //Calculete Hue
    if (delta === 0) {
        hue = 0;
    } else if (rp == cmax) {
        hue = 60 * ((gp - bp) / delta);
    } else if (gp == cmax) {
        hue = 60 * ((bp - rp) / delta + 2);
    } else { // bp == cmax
        hue = 60 * ((rp - gp) / delta + 4);
    }

    H = ((hue + 360) % 360); //Hue value to return

    //Calculate Saturation
    if (cmax === 0) {
        S = 0;
    } else {
        S = delta / cmax;
    }

    //Calcuate Value
    V = cmax;

    return {
        H: H,
        S: S,
        V: V
    };
}


//----------------- HSV To -----------------

/**
 * Color HSVToRGB
 * Color holds the definition of a Color in RGB format
 * @param H - Hue
 * @param S - Saturation
 * @param V - Value
 * @returns an Object containing {Red, Green, Blue} for the color
 */
function HSVToRGB(h, s, v) {
    //return values
    var r, g, b;

    //input validation
    if (s > 1) {
        s = 1;
    }
    if (s < 0) {
        s = 0;
    }
    if (v > 1) {
        v = 1;
    }
    if (v < 0) {
        v = 0;
    }
    h = (h % 360 + 360) % 360; //Hue 360 wraps to 0

    var i, f, p, q, t;

    if (s === 0) {
        // achromatic (grey)
        r = Math.round(v * 255);
        g = Math.round(v * 255);
        b = Math.round(v * 255);
    } else {
        // chroma (color)
        var hue = h / 60; // sector 0 to 5
        i = Math.floor(hue);
        f = hue - i; // factorial part of hue
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
            case 0:
                r = Math.round(v * 255);
                g = Math.round(t * 255);
                b = Math.round(p * 255);
                break;
            case 1:
                r = Math.round(q * 255);
                g = Math.round(v * 255);
                b = Math.round(p * 255);
                break;
            case 2:
                r = Math.round(p * 255);
                g = Math.round(v * 255);
                b = Math.round(t * 255);
                break;
            case 3:
                r = Math.round(p * 255);
                g = Math.round(q * 255);
                b = Math.round(v * 255);
                break;
            case 4:
                r = Math.round(t * 255);
                g = Math.round(p * 255);
                b = Math.round(v * 255);
                break;
            default: // case 5:
                r = Math.round(v * 255);
                g = Math.round(p * 255);
                b = Math.round(q * 255);
                break;
        }
    }
    return {
        Red: r,
        Green: g,
        Blue: b
    };
}

/**
 * Color HSVToQRgb
 * Color holds the definition of a Color in RGB format
 * @param H - Hue
 * @param S - Saturation
 * @param V - Value
 * @returns an Object containing {Red, Green, Blue} for the color
 */
function HSVToQRgb(h, s, v) {
    //return values
    var r, g, b;

    //input validation
    if (s > 1) {
        s = 1;
    }
    if (s < 0) {
        s = 0;
    }
    if (v > 1) {
        v = 1;
    }
    if (v < 0) {
        v = 0;
    }
    h = (h % 360 + 360) % 360; //Hue 360 wraps to 0

    var i, f, p, q, t;

    if (s === 0) {
        // achromatic (grey)
        r = Math.round(v * 255);
        g = Math.round(v * 255);
        b = Math.round(v * 255);
    } else {
        // chroma (color)
        var hue = h / 60; // sector 0 to 5
        i = Math.floor(hue);
        f = hue - i; // factorial part of hue
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
            case 0:
                r = Math.round(v * 255);
                g = Math.round(t * 255);
                b = Math.round(p * 255);
                break;
            case 1:
                r = Math.round(q * 255);
                g = Math.round(v * 255);
                b = Math.round(p * 255);
                break;
            case 2:
                r = Math.round(p * 255);
                g = Math.round(v * 255);
                b = Math.round(t * 255);
                break;
            case 3:
                r = Math.round(p * 255);
                g = Math.round(q * 255);
                b = Math.round(v * 255);
                break;
            case 4:
                r = Math.round(t * 255);
                g = Math.round(p * 255);
                b = Math.round(v * 255);
                break;
            default: // case 5:
                r = Math.round(v * 255);
                g = Math.round(p * 255);
                b = Math.round(q * 255);
                break;
        }
    }
    return (r << 16) + (g << 8) + b;
}
