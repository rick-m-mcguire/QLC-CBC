// Development tool access
var testAlgo;

/**
Produces a pattern that varies the intensity of the color by the sine wave.

Inputs
Maximum - intensity between 0 and 100
Minimum - intensity between 0 and 100
Period - the number of steps for 1 full sine wave.
Size - the number of fixtures for 1 full sine wave. (Offset = 2*PI/Size)

Rand_Offset = hidden random value so the effect doesnt always start at the far left.

SEE https://en.wikipedia.org/wiki/Square_wave

*/

(

  function()
  {
    var algo = {};
    algo.apiVersion = 2;
    algo.name = "Square-Wave";
    algo.author = "Rick McGuire";
    algo.acceptColors = 1; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
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
function RGBToQRgb(r,g,b){
  return (r << 16) + (g << 8) + b;
}

/**
* Color RGBToHue
* @param r - the amount of Red 0-255
* @param g - the amount of Green 0-255
* @param b - the amount of Blue 0-255
* @returns an Object Containing {H,S,V} for the color
*/
function RGBToHSV(r,g,b) {
  //Values to return
  var H, S, V;

  var rp = r/255.0;
  var gp = g/255.0;
  var bp = b/255.0;
  var cmax = Math.max(rp,Math.max(gp,bp));
  var cmin = Math.min(rp,Math.min(gp,bp));
  var delta = cmax - cmin;
  var hue; // the hue placeholder

  //Calculate Hue
  if (delta === 0){
    hue = 0;
  } else if (rp == cmax) {
    hue = 60*((gp-bp)/delta);
  } else if (gp == cmax) {
    hue = 60*((bp-rp)/delta +2);
  } else { // bp == cmax
    hue = 60*((rp-gp)/delta +4);
  }

  H = ((hue+360) % 360); //Hue value to return

  //Calculate Saturation
  if (cmax === 0){
    S = 0;
  } else {
    S = delta / cmax;
  }

  //Calcuate Value
  V = cmax;

  return {H: H, S: S, V: V};
}

//----------------- QRgb TO -----------------

/**
* Color QRgbToRGB
* @param QRgb - the QRgb representing the color
* @returns an Object containing {Red, Green, Blue} for the color
*/
function QRgbToRGB(QRgb){
  // remove alpha chanel
  QRgb = QRgb & 0x00ffffff;
  // input validation
  if(QRgb>0xFFFFFF){
    QRgb=0x65CA7B;
  }
  if(QRgb<0){
    QRgb=0;
  }
  return {Red: Math.round(((QRgb >> 16) & 0x00FF)), Green: Math.round(((QRgb >> 8) & 0x00FF)), Blue: Math.round((QRgb & 0x00FF))};
}

/**
* Color QRgbToHSV
* @param QRgb - the QRgb representing the color
* @returns an Object Containing {H,S,V} for the color
*/
function QRgbToHSV(QRgb){
  // remove alpha chanel
  QRgb = QRgb & 0x00ffffff;
  //input validation
  if(QRgb>0xFFFFFF){
    QRgb=0x6FDE7B; //Error Code 111 222 123
  }
  if(QRgb<0){
    QRgb=0;
  }

  //Values to return
  var H, S, V;
  var rp = Math.round((QRgb >> 16) & 0x00FF)/255.0;
  var gp = Math.round((QRgb >> 8) & 0x00FF)/255.0;
  var bp = Math.round(QRgb & 0x00FF)/255.0;
  var cmax = Math.max(rp,Math.max(gp,bp));
  var cmin = Math.min(rp,Math.min(gp,bp));
  var delta = cmax - cmin;
  var hue; // the hue placeholder

  //Calculete Hue
  if (delta === 0){
    hue = 0;
  } else if (rp == cmax) {
    hue = 60*((gp-bp)/delta);
  } else if (gp == cmax) {
    hue = 60*((bp-rp)/delta +2);
  } else { // bp == cmax
    hue = 60*((rp-gp)/delta +4);
  }

  H = ((hue+360) % 360); //Hue value to return

  //Calculate Saturation
  if (cmax === 0){
    S = 0;
  } else {
    S = delta / cmax;
  }

  //Calcuate Value
  V = cmax;

  return {H: H, S: S, V: V};
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
function HSVToRGB(h,s,v) {
  //return values
  var r, g, b;

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

  if( s === 0 ) {
    // achromatic (grey)
    r = Math.round(v*255);
    g = Math.round(v*255);
    b = Math.round(v*255);
  }
  else {
    // chroma (color)
    var hue = h / 60;      // sector 0 to 5
    i = Math.floor( hue );
    f = hue - i;      // factorial part of hue
    p = v * ( 1 - s );
    q = v * ( 1 - s * f );
    t = v * ( 1 - s * ( 1 - f ) );

    switch( i ) {
      case 0:
      r = Math.round(v*255);
      g = Math.round(t*255);
      b = Math.round(p*255);
      break;
      case 1:
      r = Math.round(q*255);
      g = Math.round(v*255);
      b = Math.round(p*255);
      break;
      case 2:
      r = Math.round(p*255);
      g = Math.round(v*255);
      b = Math.round(t*255);
      break;
      case 3:
      r = Math.round(p*255);
      g = Math.round(q*255);
      b = Math.round(v*255);
      break;
      case 4:
      r = Math.round(t*255);
      g = Math.round(p*255);
      b = Math.round(v*255);
      break;
      default:    // case 5:
      r = Math.round(v*255);
      g = Math.round(p*255);
      b = Math.round(q*255);
      break;
    }
  }
  return {Red: r, Green: g, Blue: b};
}

/**
* Color HSVToQRgb
* Color holds the definition of a Color in RGB format
* @param H - Hue
* @param S - Saturation
* @param V - Value
* @returns an Object containing {Red, Green, Blue} for the color
*/
function HSVToQRgb(h,s,v) {
  //return values
  var r, g, b;

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

  if( s === 0 ) {
    // achromatic (grey)
    r = Math.round(v*255);
    g = Math.round(v*255);
    b = Math.round(v*255);
  }
  else {
    // chroma (color)
    var hue = h / 60;      // sector 0 to 5
    i = Math.floor( hue );
    f = hue - i;      // factorial part of hue
    p = v * ( 1 - s );
    q = v * ( 1 - s * f );
    t = v * ( 1 - s * ( 1 - f ) );

    switch( i ) {
      case 0:
      r = Math.round(v*255);
      g = Math.round(t*255);
      b = Math.round(p*255);
      break;
      case 1:
      r = Math.round(q*255);
      g = Math.round(v*255);
      b = Math.round(p*255);
      break;
      case 2:
      r = Math.round(p*255);
      g = Math.round(v*255);
      b = Math.round(t*255);
      break;
      case 3:
      r = Math.round(p*255);
      g = Math.round(q*255);
      b = Math.round(v*255);
      break;
      case 4:
      r = Math.round(t*255);
      g = Math.round(p*255);
      b = Math.round(v*255);
      break;
      default:    // case 5:
      r = Math.round(v*255);
      g = Math.round(p*255);
      b = Math.round(q*255);
      break;
    }
  }
  return (r << 16) + (g << 8) + b;
}
