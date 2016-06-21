// Development tool access
var testAlgo;

(

    function()
    {
        var algo = new Object;
        algo.apiVersion = 2;
        algo.name = "All Colours";
        algo.author = "Rick McGuire";
		    algo.acceptColors = 2;
        algo.properties = new Array();

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
          // Create Variables
          var r = 0; //Row to fill
          var c = 0; //Column to fill

          //create empty map
          var map = new Array(height);
          /*
           *  Initialise Map to all black
           */
          for (var y = 0; y < height; y++)
          {
            map[y] = new Array();
            for (var x = 0; x < width; x++)
            {
              map[y][x] = rgb;
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
            // All pixels in the map must be used exactly once, each one separately
            // at a time. Therefore, the maximum number of steps produced by this
            // script on a 5 * 5 grid is 25.
            return 2;
			      //width * height;
        }

        // Development tool access
        testAlgo = algo;

        return algo;
    }
)()
