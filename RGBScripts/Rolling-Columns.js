/*
  Q Light Controller
  Rolling Columns.js

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
     * Description TODO
     */
    function()
    {
        var algo = new Object;
        algo.apiVersion = 2;
        algo.name = "Rolling Columns";
        algo.author = "Rick McGuire";
        algo.acceptColors = 2;

        algo.properties = new Array();
        algo.NumCol = 1;
        algo.properties.push("name:NumCol|type:range|display:Number of Columns|values:1,99|write:setNumCol|read:getNumCol"); //Number of Pixels to roll around
        algo.NumCycles = 1;
        algo.properties.push("name:NumCycles|type:range|display:Number of Cycles|values:1,99|write:setNumCycle|read:getNumCycle"); //Number of Cycles to change between two colours.

        algo.setNumCol = function(_preset)
        {
          algo.NumCol = _preset
        }

        algo.getNumCol = function()
        {
          return ""+algo.NumCol;
        }

        //Cycles set/get
        algo.setNumCycle = function(_preset)
        {
          algo.NumCycles = _preset
        }

        algo.getNumCycle = function()
        {
          return ""+algo.NumCycles;
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
      			/*
      			 *  Initialise Map to all black
      			 */
      			for (var y = 0; y < height; y++)
                  {
                      map[y] = new Array();
                      for (var x = 0; x < width; x++)
                      {
                          map[y][x] = 0;
                      }
                  }

      			/*
      			 *  Set Columns to rgb
      			 *  Sets the current step column and the n previous columns to the rgb value
      			 */
      			var col = 0; // initialise temp variable
      			for (var i = 0; i < Math.min(algo.NumCol,width); i++){
                    col = ((step + i) % width + width) % width; // find the column to fill because equal to "step - i mod [width]"
                    //col = ((step - i) % width + width) % width; // find the column to fill because equal to "step - i mod [width]"
        				for (var y = 0; y < height; y++)
        				{
        					map[y][col] = rgb;
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
            // Number of Steps is the width of the matrix x number of cycles
            //return width*4;
            return width * algo.NumCycles;
        }

        // Development tool access
        testAlgo = algo;

        return algo;
    }
)()
