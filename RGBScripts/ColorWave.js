// Development tool access
var testAlgo;

(

    function()
    {
        var algo = new Object;
        algo.apiVersion = 2;
        algo.name = "ColorWave";
        algo.author = "Rick McGuire";
		    algo.acceptColors = 1; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
        algo.properties = new Array();

        /**
         * Custom Property Definition
         */
        algo.HueRange = 30;
        algo.properties.push("name:HueRange|type:range|display:Hue Range|values:0,180|write:setHueRange|read:getHueRange");

        algo.NumSteps = 10;
        /**
         * Custom Property Getter and Setter methods
         */
        algo.setHueRange = function(_preset)
        {
          algo.HueRange = _preset;
        }

        algo.getHueRange = function()
        {
          return ""+algo.HueRange;
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
          // Create the color
          var c = new Color();
          c.setAsQRgb(rgb);

          //Create the HSV for the color
          var h,s,v;
          h = c.getHue();
          s = c.getSat();
          v = c.getVal();

          // Workout the Hue for the step
          var newHue = h;
          var i = 0;
          var pos = 0;
          var up = true;
          while (i!=step){
            if (up){
              newHue = newHue+algo.HueRange/algo.NumSteps;
              pos++;
              i++;
            }
            else {
              newHue = newHue-algo.HueRange/algo.NumSteps;
              pos--;
              i++;
            }
            if (pos>algo.NumSteps){
              up = false;
            }
            if (pos<-algo.NumSteps){
              up = true;
            }
          }

          // Set Color to newHue
          c.setAsHSV(newHue,s,v);

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
              map[y][x] = c.getQRgb();
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
            return 4*algo.NumSteps;
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
  * @constructor
  */
function Color(){
  //Stores a colour as 3 16bit numbers. 0..65535
  this.Red = 0;
  this.Green = 0;
  this.Blue = 0;

  /* Set Functions */

  /**
   * Sets the color based on 16 bit rgb
   */
  this.setAsRGB16 = function (r, g, b){
    this.Red = Math.min(65535,Math.max(r,0));
    this.Green = Math.min(65535,Math.max(g,0));
    this.Blue = Math.min(65535,Math.max(b,0));
  }

  /**
   * Sets the color based on 8 bit rgb
   */
  this.setAsRGB8 = function (r, g, b){
    this.Red = Math.min(65535,Math.max(r/255*65535,0));
    this.Green = Math.min(65535,Math.max(g/255*65535,0));
    this.Blue = Math.min(65535,Math.max(b/255*65535,0));
  }

  /**
   * Sets the color based on a QRgb
   */
  this.setAsQRgb = function (QRgb){
    //input validation
    if(QRgb>0xFFFFFF){
      QRgb=0xFFFFFF;
    }
    if(QRgb<0){
      QRgb=0;
    }

    // Bitwise roll and bitmask last 8 bytes
    this.Red = Math.round(((QRgb >> 16) & 0x00FF))/255*65535;
    this.Green = Math.round(((QRgb >> 8) & 0x00FF))/255*65535;
    this.Blue = Math.round((QRgb & 0x00FF))/255*65535;
  }

  /**
   * Sets the color based on hsv
   * stolen from https://www.cs.rit.edu/~ncs/color/t_convert.html and color.js
   */
  this.setAsHSV = function (h, s, v){
    //input validation
    if (s>1){
      s=1;
    }
    if(s<0){
      s=0;
    }
    if (v>1){
      v=1;
    }
    if(v<0){
      v=0;
    }
    h = (h % 360 + 360) % 360; //Hue 360 wraps to 0

    var i, f, p, q, t;

    if( s == 0 ) {
      // achromatic (grey)
      this.Red = Math.round(v*65535);
      this.Green = Math.round(v*65535);
      this.Blue = Math.round(v*65535);
    }
    else {
      // chroma
      var hue = h / 60;      // sector 0 to 5
      i = Math.floor( hue );
      f = hue - i;      // factorial part of hue
      p = v * ( 1 - s );
      q = v * ( 1 - s * f );
      t = v * ( 1 - s * ( 1 - f ) );

      switch( i ) {
        case 0:
          this.Red = Math.round(v*65535);
          this.Green = Math.round(t*65535);
          this.Blue = Math.round(p*65535);
          break;
        case 1:
          this.Red = Math.round(q*65535);
          this.Green = Math.round(v*65535);
          this.Blue = Math.round(p*65535);
          break;
        case 2:
          this.Red = Math.round(p*65535);
          this.Green = Math.round(v*65535);
          this.Blue = Math.round(t*65535);
          break;
        case 3:
          this.Red = Math.round(p*65535);
          this.Green = Math.round(q*65535);
          this.Blue = Math.round(v*65535);
          break;
        case 4:
          this.Red = Math.round(t*65535);
          this.Green = Math.round(p*65535);
          this.Blue = Math.round(v*65535);
          break;
        default:    // case 5:
          this.Red = Math.round(v*65535);
          this.Green = Math.round(p*65535);
          this.Blue = Math.round(q*65535);
          break;
      }
    }

  }

  /** Get Functions */

  /**
   * Get Color's Red component as an 8 bit value
   */
  this.getRed8 = function (){
    return Math.round(this.Red/65535*255);
  }

  /**
   * Get Color's Green component as an 8 bit value
   */
  this.getGreen8 = function (){
    return Math.round(this.Green/65535*255);
  }

  /**
   * Get Color's Blue component as an 8 bit value
   */
  this.getBlue8 = function (){
    return Math.round(this.Blue/65535*255);
  }

  /**
   * Get Color's Red component as an 16 bit value
   */
  this.getRed16 = function (){
    return this.Red;
  }

  /**
   * Get Color's Green component as an 16 bit value
   */
  this.getGreen16 = function (){
    return this.Green;
  }

  /**
   * Get Color's Blue component as an 16 bit value
   */
  this.getBlue16 = function (){
    return this.Blue;
  }

  /**
   * Get Color as a QRgb
   */
  this.getQRgb = function (){
    var r = Math.round(this.Red/65535*255);
    var g = Math.round(this.Green/65535*255);
    var b = Math.round(this.Blue/65535*255);
    return (r << 16) + (g << 8) + b;
  }

  /**
   * Get Color's Hue component.
   * @return {int} the Hue 0 to 360
   *
   * Algorithms source http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
  */
  this.getHue = function (){
    var rp = this.Red/65535.0;
    var gp = this.Green/65535.0;
    var bp = this.Blue/65535.0;
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

  /**
   * Get the Saturation of the color - as 0-1
   * http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
  */
  this.getSat = function (){
    var rp = this.Red/65535.0;
    var gp = this.Green/65535.0;
    var bp = this.Blue/65535.0;
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

  /**
   * Get the Value of the color - as 0-1
   * http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
  */
  this.getVal = function (){
    var rp = this.Red/65535.0;
    var gp = this.Green/65535.0;
    var bp = this.Blue/65535.0;
    var cmax = Math.max(rp,Math.max(gp,bp));
    return cmax;
  }
}
