/*
  Q Light Controller Plus
  Colour-Wipe.js v1.0

  Copyright (c) Rick McGuire

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0.txt

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// Development tool access
var testAlgo;

(

    function() {
        var algo = {};
        algo.apiVersion = 2;
        algo.name = "Colour Wipe";
        algo.author = "Rick McGuire";
        algo.acceptColors = 0; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
        algo.properties = [];
        algo.WipeMode = "Left-To-Right";
        algo.properties.push("name:WipeMode|type:list|display:Wipe Mode|values:Left-To-Right,Right-To-Left,Top-To-Bottom,Bottom-To-Top,Diagonal-Top-Left,Diagonal-Top-Right,Diagonal-Bottom-Left,Diagonal-Bottom-Right,Square-Top-Left,Square-Top-Right,Square-Bottom-Left,Square-Bottom-Right|write:setWipeMode|read:getWipeMode");
        algo.Colour_1_Red = 255;
        algo.properties.push("name:Colour_1_Red|type:range|display:Colour1 Red|values:0,255|write:setColour_1_Red|read:getColour_1_Red");
        algo.Colour_1_Green = 0;
        algo.properties.push("name:Colour_1_Green|type:range|display:Colour1 Green|values:0,255|write:setColour_1_Green|read:getColour_1_Green");
        algo.Colour_1_Blue = 0;
        algo.properties.push("name:Colour_1_Blue|type:range|display:Colour1 Blue|values:0,255|write:setColour_1_Blue|read:getColour_1_Blue");
        algo.Colour_2_Red = 0;
        algo.properties.push("name:Colour_2_Red|type:range|display:Colour2 Red|values:0,255|write:setColour_2_Red|read:getColour_2_Red");
        algo.Colour_2_Green = 0;
        algo.properties.push("name:Colour_2_Green|type:range|display:Colour2 Green|values:0,255|write:setColour_2_Green|read:getColour_2_Green");
        algo.Colour_2_Blue = 255;
        algo.properties.push("name:Colour_2_Blue|type:range|display:Colour2 Blue|values:0,255|write:setColour_2_Blue|read:getColour_2_Blue");

        var util = {}; //holder object for algorithm data
        var C1 = 0; // Qrgb  for Colour1
        var C2 = 0; // Qrgb  for Colour2

        /*
         * ====================================================================
         * Getter and Setter Functions for custom properties.
         * On a change set initialize to false to force re-initialize
         * ====================================================================
         */

        algo.setWipeMode = function(_WipeModeValue) {
            algo.WipeMode = _WipeModeValue;
            algo.initialized = false;
        };

        algo.getWipeMode = function() {
            return algo.WipeMode;
        };

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

        /**
         * Initializes / Sets the Colour 1/2 Values based on the user input and
         * convets them to Qrgb values.
         * @param width The width of the map
         * @param height The height of the map
         * @param rgb Tells the colour requested by user in the UI.
         * @param step The step number that is requested (0 to (algo.rgbMapStepCount - 1))
         * @return Nothing
         */
        util.initialize = function(width, height, rgb, step) {
            C1 = RGBToQRgb(algo.Colour_1_Red, algo.Colour_1_Green, algo.Colour_1_Blue);
            C2 = RGBToQRgb(algo.Colour_2_Red, algo.Colour_2_Green, algo.Colour_2_Blue);
            algo.initialized = true;
            return;
        };

        /**
         * The actual "algorithm" for this RGB script. Produces a map of
         * size($width, $height) each time it is called.
         * @param width The width of the map
         * @param height The height of the map
         * @param rgb Tells the colour requested by user in the UI.
         * @param step The step number that is requested (0 to (algo.rgbMapStepCount - 1))
         * @return A two-dimensional array[height][width].
         */
        algo.rgbMap = function(width, height, rgb, step) {

            //initialize the colours if not already.
            if (algo.initialized === false) {
                util.initialize(width, height, rgb, step);
            }

            //Set Base and Fill Colours
            var base = C1;
            var fill = C2;

            //flip base/fill colours when over halfway
            if (step >= width && algo.WipeMode == "Left-To-Right") {
                base = C2;
                fill = C1;
            }
            if (step >= width && algo.WipeMode == "Right-To-Left") {
                base = C2;
                fill = C1;
            }

            if (step >= height && algo.WipeMode == "Top-To-Bottom") {
                base = C2;
                fill = C1;
            }
            if (step >= height && algo.WipeMode == "Bottom-To-Top") {
                base = C2;
                fill = C1;
            }

            if (step >= width && step >= height && algo.WipeMode == "Square-Top-Left") {
                base = C2;
                fill = C1;
            }
            if (step >= width && step >= height && algo.WipeMode == "Square-Bottom-Right") {
                base = C2;
                fill = C1;
            }
            if (step >= width && step >= height && algo.WipeMode == "Square-Top-Right") {
                base = C2;
                fill = C1;
            }
            if (step >= width && step >= height && algo.WipeMode == "Square-Bottom-Left") {
                base = C2;
                fill = C1;
            }

            var map = new Array(height);

            for (var y = 0; y < height; y++) {
                map[y] = [];
                for (var x = 0; x < width; x++) {
                    map[y][x] = base; //Set pixel to base colour

                    // Replace base colour with fill according to the wipe mode
                    switch (algo.WipeMode) {
                        case "Left-To-Right":
                            if (x < (step % width)) {
                                map[y][x] = fill;
                            }
                            break;

                        case "Right-To-Left":
                            if (x >= (width - (step % width))) {
                                map[y][x] = fill;
                            }
                            break;

                        case "Top-To-Bottom":
                            if (y < (step % height)) {
                                map[y][x] = fill;
                            }
                            break;

                        case "Bottom-To-Top":
                            if (y >= (height - (step % height))) {
                                map[y][x] = fill;
                            }
                            break;

                        case "Diagonal-Top-Left":
                            if (step < (width + height - 1)) {
                                if (x + y < step) {
                                    map[y][x] = C2;
                                } else {
                                    map[y][x] = C1;
                                }
                            } else {
                                if (x + y < step % (width + height - 1)) {
                                    map[y][x] = C1;
                                } else {
                                    map[y][x] = C2;
                                }
                            }
                            break;

                        case "Diagonal-Top-Right":
                            if (step < (width + height - 1)) {
                                if ((width - x - 1) + (y) < step) {
                                    map[y][x] = C2;
                                } else {
                                    map[y][x] = C1;
                                }
                            } else {
                                if ((width - x - 1) + (y) < step % (width + height - 1)) {
                                    map[y][x] = C1;
                                } else {
                                    map[y][x] = C2;
                                }
                            }
                            break;

                        case "Diagonal-Bottom-Left":
                            if (step < (width + height - 1)) {
                                if (x + (height - y - 1) < step) {
                                    map[y][x] = C2;
                                } else {
                                    map[y][x] = C1;
                                }
                            } else {
                                if (x + (height - y - 1) < step % (width + height - 1)) {
                                    map[y][x] = C1;
                                } else {
                                    map[y][x] = C2;
                                }
                            }
                            break;
                        case "Diagonal-Bottom-Right":
                            if (step < (width + height - 1)) {
                                if ((width - x - 1) + (height - y - 1) < step) {
                                    map[y][x] = C2;
                                } else {
                                    map[y][x] = C1;
                                }
                            } else {
                                if ((width - x - 1) + (height - y - 1) < step % (width + height - 1)) {
                                    map[y][x] = C1;
                                } else {
                                    map[y][x] = C2;
                                }
                            }
                            break;

                        case "Square-Top-Left":
                            if (x < (step % Math.max(width, height))) {
                                if (y < (step % Math.max(width, height))) {
                                    map[y][x] = fill;
                                }
                            }
                            break;

                        case "Square-Top-Right":
                            if (x >= (width - (step % Math.max(width, height)))) {
                                if (y < (step % Math.max(width, height))) {
                                    map[y][x] = fill;
                                }
                            }
                            break;

                        case "Square-Bottom-Left":
                            if (x < (step % Math.max(width, height))) {
                                if (y >= (height - (step % Math.max(width, height)))) {
                                    map[y][x] = fill;
                                }
                            }
                            break;

                        case "Square-Bottom-Right":
                            if (x >= (width - (step % Math.max(width, height)))) {
                                if (y >= (height - (step % Math.max(width, height)))) {
                                    map[y][x] = fill;
                                }
                            }
                            break;

                        default:
                            // Oops Shouldn't happen. Display Noise
                            map[y][x] = RGBToQRgb(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
                    }
                }
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
            switch (algo.WipeMode) {
                case "Left-To-Right":
                    return width * 2;
                case "Right-To-Left":
                    return width * 2;
                case "Top-To-Bottom":
                    return height * 2;
                case "Bottom-To-Top":
                    return height * 2;
                case "Diagonal-Top-Left":
                    return (1.0 * width + 1.0 * height) * 2 - 2; //1.0 multiplication so values treated as numbers. Cos.... JS
                case "Diagonal-Top-Right":
                    return (1.0 * width + 1.0 * height) * 2 - 2;
                case "Diagonal-Bottom-Left":
                    return (1.0 * width + 1.0 * height) * 2 - 2;
                case "Diagonal-Bottom-Right":
                    return (1.0 * width + 1.0 * height) * 2 - 2;
                case "Square-Top-Left":
                    return Math.max(width, height) * 2;
                case "Square-Top-Right":
                    return Math.max(width, height) * 2;
                case "Square-Bottom-Left":
                    return Math.max(width, height) * 2;
                case "Square-Bottom-Right":
                    return Math.max(width, height) * 2;
                default:
                    // Oops Shouldn't happen, Give it a size
                    return width * height;
            }

            return null;
        };

        // Development tool access
        testAlgo = algo;

        return algo;
    }
)();

/**
 * RGBToQRgb
 * Converts a R, G, B values to a QRgb
 * @param r - the amount of Red 0-255
 * @param g - the amount of Green 0-255
 * @param b - the amount of Blue 0-255
 * @returns a QRgb value for the colour
 */
function RGBToQRgb(r, g, b) {
    return (r << 16) + (g << 8) + (b << 0); //bitwise shift blue becuase otherwise its treated as a string.
}
