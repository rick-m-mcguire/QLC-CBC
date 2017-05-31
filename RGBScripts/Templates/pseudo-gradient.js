// Development tool access
var testAlgo;

(

  function()
  {
    var algo = {};
    algo.apiVersion = 2;
    algo.name = "Template";
    algo.author = "Rick McGuire";
    algo.acceptColors = 0; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
    algo.properties = [];

    /**
    * Custom Property Definition
    */
    algo.TemplateProperty = 2;
    algo.properties.push("name:TemplateProperty|type:range|display:Number of Fixtures|values:1,40|write:setNumPieces|read:getNumPieces");

    /**
    * Custom Property Getter and Setter methods
    */
    algo.setTemplateProperty = function(_preset)
    {
      algo.TemplateProperty = _preset;
    };

    algo.getTemplateProperty = function()
    {
      return ""+algo.TemplateProperty;
    };

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
      return null;
    };

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
      return width * height;
      //width * height;
    };

    /**
    * The actual "algorithm" for this RGB script. Produces a map of
    * size($width, $height) each time it is called.
    *
    * @param step The step number that is requested (0 to (algo.rgbMapStepCount - 1))
    * @param rgb Tells the color requested by user in the UI.
    * @return A two-dimensional array[height][width].
    */
    util.getColours = function()
    {
      var result = null;
      switch (gradient mode) {
        case expression:

          break;
        default:

      }
      return null;
    };

    util.getColoursRGB = function(){
      var numSteps = algo.rgbMapStepCount();

      switch (numSteps) {
        case 1:
          //set to color 1
          break;
        case 2:
            //set to color 1 and 2
          break;
        default:
          //contiute to rest of algo
      }

      var rStep = (Red1 - Red2)

    };

    // Development tool access
    testAlgo = algo;

    return algo;
  }
)();
