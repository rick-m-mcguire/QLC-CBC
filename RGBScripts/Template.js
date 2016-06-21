// Development tool access
var testAlgo;

(

    function()
    {
        var algo = new Object;
        algo.apiVersion = 2;
        algo.name = "Template";
        algo.author = "Rick McGuire";
		    algo.acceptColors = 0; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
        algo.properties = new Array();

        /*
        ** Custom Property Definition
        */
        algo.TemplateProperty = 2;
        algo.properties.push("name:TemplateProperty|type:range|display:Number of Fixtures|values:1,40|write:setNumPieces|read:getNumPieces");

        /*
        ** Custom Property Getter and Setter methods
        */
        algo.setTemplateProperty = function(_preset)
        {
          algo.TemplateProperty = _preset;
        }

        algo.getTemplateProperty = function()
        {
          return ""+algo.TemplateProperty;
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
            return null;
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
            return width * height;
			      //width * height;
        }

        // Development tool access
        testAlgo = algo;

        return algo;
    }
)();

/**
 * Color Functions
 */

 /**
  * Color Constructor
  * Color holds the definition of a Color in RGB format
  * @param r - the amount of Red 0-255
  * @param g - the amount of Green 0-255
  * @param b - the amount of Blue 0-255
  */
function Color(){
  this.Red = 0;
  this.Green = 0;
  this.Blue = 0;

  /* Set Functions */

  //Sets the color based on rgb
  this.setAsRGB = function (r, g, b){
    this.Red = Math.min(255,Math.max(r,0));
    this.Green = Math.min(255,Math.max(g,0));
    this.Blue = Math.min(255,Math.max(b,0));
  }

  //Sets the color based on a qRGB
  this.setAsQRGB = function (qRGB){
    // Bitwise roll and bitmask last 8 bytes
    this.Red = Math.round(((qRGB >> 16) & 0x00FF));
    this.Green = Math.round(((qRGB >> 8) & 0x00FF));
    this.Blue = Math.round((qRGB & 0x00FF));
  }

  //Sets the color based on hsv
  //stolen from https://www.cs.rit.edu/~ncs/color/t_convert.html and color.js
  this.setAsHSV = function (h, s, v){
    var i;
    var f, p, q, t;

    if( s == 0 ) {
      // achromatic (grey)
      this.Red = Math.floor(v*255);
      this.Green = Math.floor(v*255);
      this.Blue = Math.floor(v*255);
    }
    else {

      var hue = h / 60;      // sector 0 to 5
      i = Math.floor( hue );
      f = hue - i;      // factorial part of hue
      p = v * ( 1 - s );
      q = v * ( 1 - s * f );
      t = v * ( 1 - s * ( 1 - f ) );

      switch( i ) {
        case 0:
          this.Red = Math.floor(v*255);
          this.Green = Math.floor(t*255);
          this.Blue = Math.floor(p*255);
          break;
        case 1:
          this.Red = Math.floor(q*255);
          this.Green = Math.floor(v*255);
          this.Blue = Math.floor(p*255);
          break;
        case 2:
          this.Red = Math.floor(p*255);
          this.Green = Math.floor(v*255);
          this.Blue = Math.floor(t*255);
          break;
        case 3:
          this.Red = Math.floor(p*255);
          this.Green = Math.floor(q*255);
          this.Blue = Math.floor(v*255);
          break;
        case 4:
          this.Red = Math.floor(t*255);
          this.Green = Math.floor(p*255);
          this.Blue = Math.floor(v*255);
          break;
        default:    // case 5:
          this.Red = Math.floor(v*255);
          this.Green = Math.floor(p*255);
          this.Blue = Math.floor(q*255);
          break;
      }
    }

  }

  /* Get Functions */
  this.getQRGB = function (){
    return (this.Red << 16) + (this.Green << 8) + this.Blue;
  }

  //gets the Hue of the color - http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
  this.getHue = function (){
    var rp = this.Red/255.0;
    var gp = this.Green/255.0;
    var bp = this.Blue/255.0;
    var cmax = Math.max(rp,Math.max(gp,bp));
    var cmin = Math.min(rp,Math.min(gp,bp));
    var delta = cmax - cmin;
    var hue; // the hue placeholder

    if (delta == 0){
      hue = 0;
    } else if (rp == cmax) {
      hue = 60*((gp-bp)/delta);
    } else if (gp == cmax) {
      hue = 60*((bp-rp)/delta +2);
    } else { // bp == cmax
      hue = 60*((rp-gp)/delta +4);
    }

    return ((hue+360) % 360);
  }

  //gets the saturation of the color - http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
  this.getSat = function (){
    var rp = this.Red/255.0;
    var gp = this.Green/255.0;
    var bp = this.Blue/255.0;
    var cmax = Math.max(rp,Math.max(gp,bp));
    var cmin = Math.min(rp,Math.min(gp,bp));
    var delta = cmax - cmin;
    var sat; // the saturation place holder

    if (cmax == 0){
      sat = 0;
    } else {
      sat = delta / cmax;
    }
    return sat;
  }

  //gets the value of the color - http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
  this.getVal = function (){
    var rp = this.Red/255.0;
    var gp = this.Green/255.0;
    var bp = this.Blue/255.0;
    var cmax = Math.max(rp,Math.max(gp,bp));
    return cmax;
  }
}
