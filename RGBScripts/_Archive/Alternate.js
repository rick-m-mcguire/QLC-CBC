/*
  Q Light Controller
  Alternate.js

  Based on EvenOdd.js by Heikki Junnila

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
    /**
     * This algorithm produces a very simple two-step even/odd pattern. Step one lights
     * odd pixels and step two lights even pixels.
     */
    function()
    {
        var algo = new Object;
        algo.apiVersion = 2;
        algo.name = "Alternate";
        algo.author = "Rick McGuire";
        algo.acceptColors = 0;
        algo.properties = new Array();
        algo.presetIndex = 0;
        algo.properties.push("name:presetIndex|type:list|display:Preset|values:Red / Lime,Red / Blue,Red / Cyan,Red / Magenta,Red / Yellow,Lime / Red,Lime / Blue,Lime / Cyan,Lime / Magenta,Lime / Yellow,Blue / Red,Blue / Lime,Blue / Cyan,Blue / Magenta,Blue / Yellow,Cyan / Red,Cyan / Lime,Cyan / Blue,Cyan / Magenta,Cyan / Yellow,Magenta / Red,Magenta / Lime,Magenta / Blue,Magenta / Cyan,Magenta / Yellow,Yellow / Red,Yellow / Lime,Yellow / Blue,Yellow / Cyan,Yellow / Magenta|write:setPreset|read:getPreset");

        //Create Variables for Colour Options
        algo.RGB1 = 0xFF0000;
        algo.RGB2 = 0x0000FF;

        algo.setPreset = function(_preset)
        {

          switch (_preset) {
            case 'Red / Lime':
              algo.RGB1 =0xFF0000;
              algo.RGB2 = 0x00FF00;
              break;
            case 'Red / Blue':
              algo.RGB1 =0xFF0000;
              algo.RGB2 = 0x0000FF;
              break;
            case 'Red / Cyan':
              algo.RGB1 =0xFF0000;
              algo.RGB2 = 0x00FFFF;
              break;
            case 'Red / Magenta':
              algo.RGB1 =0xFF0000;
              algo.RGB2 = 0xFF00FF;
              break;
            case 'Red / Yellow':
              algo.RGB1 =0xFF0000;
              algo.RGB2 = 0xFFFF00;
              break;
            case 'Lime / Red':
              algo.RGB1 =0x00FF00;
              algo.RGB2 = 0xFF0000;
              break;
            case 'Lime / Blue':
              algo.RGB1 =0x00FF00;
              algo.RGB2 = 0x0000FF;
              break;
            case 'Lime / Cyan':
              algo.RGB1 =0x00FF00;
              algo.RGB2 = 0x00FFFF;
              break;
            case 'Lime / Magenta':
              algo.RGB1 =0x00FF00;
              algo.RGB2 = 0xFF00FF;
              break;
            case 'Lime / Yellow':
              algo.RGB1 =0x00FF00;
              algo.RGB2 = 0xFFFF00;
              break;
            case 'Blue / Red':
              algo.RGB1 =0x0000FF;
              algo.RGB2 = 0xFF0000;
              break;
            case 'Blue / Lime':
              algo.RGB1 =0x0000FF;
              algo.RGB2 = 0x00FF00;
              break;
            case 'Blue / Cyan':
              algo.RGB1 =0x0000FF;
              algo.RGB2 = 0x00FFFF;
              break;
            case 'Blue / Magenta':
              algo.RGB1 =0x0000FF;
              algo.RGB2 = 0xFF00FF;
              break;
            case 'Blue / Yellow':
              algo.RGB1 =0x0000FF;
              algo.RGB2 = 0xFFFF00;
              break;
            case 'Cyan / Red':
              algo.RGB1 =0x00FFFF;
              algo.RGB2 = 0xFF0000;
              break;
            case 'Cyan / Lime':
              algo.RGB1 =0x00FFFF;
              algo.RGB2 = 0x00FF00;
              break;
            case 'Cyan / Blue':
              algo.RGB1 =0x00FFFF;
              algo.RGB2 = 0x0000FF;
              break;
            case 'Cyan / Magenta':
              algo.RGB1 =0x00FFFF;
              algo.RGB2 = 0xFF00FF;
              break;
            case 'Cyan / Yellow':
              algo.RGB1 =0x00FFFF;
              algo.RGB2 = 0xFFFF00;
              break;
            case 'Magenta / Red':
              algo.RGB1 =0xFF00FF;
              algo.RGB2 = 0xFF0000;
              break;
            case 'Magenta / Lime':
              algo.RGB1 =0xFF00FF;
              algo.RGB2 = 0x00FF00;
              break;
            case 'Magenta / Blue':
              algo.RGB1 =0xFF00FF;
              algo.RGB2 = 0x0000FF;
              break;
            case 'Magenta / Cyan':
              algo.RGB1 =0xFF00FF;
              algo.RGB2 = 0x00FFFF;
              break;
            case 'Magenta / Yellow':
              algo.RGB1 =0xFF00FF;
              algo.RGB2 = 0xFFFF00;
              break;
            case 'Yellow / Red':
              algo.RGB1 =0xFFFF00;
              algo.RGB2 = 0xFF0000;
              break;
            case 'Yellow / Lime':
              algo.RGB1 =0xFFFF00;
              algo.RGB2 = 0x00FF00;
              break;
            case 'Yellow / Blue':
              algo.RGB1 =0xFFFF00;
              algo.RGB2 = 0x0000FF;
              break;
            case 'Yellow / Cyan':
              algo.RGB1 =0xFFFF00;
              algo.RGB2 = 0x00FFFF;
              break;
            case 'Yellow / Magenta':
              algo.RGB1 =0xFFFF00;
              algo.RGB2 = 0xFF00FF;
              break;
            default:
            algo.RGB1 =0xFFFFFF;
            algo.RGB2 = 0x000000;
          }
          util.initialize();
        }

        algo.getPreset = function()
        {
          return "TO DO";
        }

        /**
         * The actual "algorithm" for this RGB script. Produces a map of
         * size($width, $height) each time it is called.
         *
         * @param step The step number that is requested (0 to (algo.rgbMapStepCount - 1))
         * @param rgb Tells the color requested by user in the UI.
         * @return A two-dimensional array[height][width].
         */
        algo.rgbMap = function(width, height, rgb, step)
        {
            var map = new Array(height);
            var i = step;
            for (var y = 0; y < height; y++)
            {
                map[y] = new Array();
                for (var x = 0; x < width; x++)
                {
                    if ((i % 2) == 0)
                        map[y][x] = algo.RGB1;
                    else
                        map[y][x] = algo.RGB2;
                    i++;
                }
            }
            return map;
        }

        /**
         * Tells RGB Matrix how many steps this algorithm produces with size($width, $height)
         *
         * @param width The width of the map
         * @param height The height of the map
         * @return Number of steps required for a map of size($width, $height)
         */
        algo.rgbMapStepCount = function(width, height)
        {
            // Only two steps; one for even pixels and another for odd pixels
            return 2;
        }

        // Development tool access
        testAlgo = algo;

        return algo;
    }
)()
