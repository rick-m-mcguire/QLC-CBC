/*
*
* How It Works:
* Color changes from HueStart to HueEnd in a Clockwise or Anti-Clockwise direction.
*
*
*
*
*/


// Development tool access
var testAlgo;

(

  function()
  {
    var algo = {};
    algo.apiVersion = 2;
    algo.name = "Hue Wave";
    algo.author = "Rick McGuire";
    algo.acceptColors = 0; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
    algo.properties = [];

    /**************************************************
    * Custom Property Definition
    */
    algo.HueStart = 0;
    algo.properties.push("name:HueStart|type:range|display:Hue Start|values:0,360|write:setHueStart|read:getHueStart");

    /**
    * Custom Property Getter and Setter methods
    */
    algo.setHueStart = function(setHueStartValue) {
      algo.HueStart = setHueStartValue*1;
    };

    algo.getHueStart = function() {
      return "" + algo.HueStart;
    };

    /**************************************************
    * Custom Property Definition
    */
    algo.HueEnd = 180;
    algo.properties.push("name:HueEnd|type:range|display:Hue End|values:0,360|write:setHueEnd|read:getHueEnd");

    /**
    * Custom Property Getter and Setter methods
    */
    algo.setHueEnd = function(setHueEndValue) {
      algo.HueEnd = setHueEndValue*1;
    };

    algo.getHueEnd = function() {
      return "" + algo.HueEnd;
    };

    /**************************************************
    * Custom Property Definition
    */
    algo.Direction = "Clockwise";
    algo.properties.push("name:Direction|type:list|display:Direction|values:Clockwise,Anti-Clockwise|write:setDirection|read:getDirection");

    /**
    * Custom Property Getter and Setter methods
    */
    algo.setDirection = function(setDirectionValue) {
      algo.Direction = setDirectionValue;
    };

    algo.getDirection = function() {
      return "" + algo.Direction;
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
      var c;
      var h,s,v,hueStep;
      var mode;

      h = algo.HueStart;
      s = 1;
      v = 1;

      hueStep = 1;

      mode = algo.Direction;
      if (algo.getDegrees == 360){
        mode = "Circle";
      }

      //create empty map
      var map = new Array(height);

      c = rgb; //TEST - remove
      var rgbMapStepCount = algo.rgbMapStepCount();
      for (var y = 0; y < height; y++)
      {
        map[y] = [];
        for (var x = 0; x < width; x++)
        {
          switch (mode) {
            case "Clockwise":
            if(step<=(rgbMapStepCount+1)/2){
              c = HSVToQRgb(algo.HueStart+step*hueStep,s,v);
              map[y][x] = c;
            }
            else {
              c = HSVToQRgb(algo.HueStart+(((rgbMapStepCount+1))-step)*hueStep,s,v);
              map[y][x] = c;
            }
            break;
            case "Anti-Clockwise":
            if(step<=(rgbMapStepCount+1)/2){
              c = HSVToQRgb(algo.HueStart-step*hueStep,s,v);
              map[y][x] = c;
            }
            else {
              c = HSVToQRgb(algo.HueStart-(((rgbMapStepCount+1))-step)*hueStep,s,v);
              map[y][x] = c;
            }
            break;
            case "Circle":
            c = HSVToQRgb(algo.HueStart+step*hueStep,s,v);
            map[y][x] = c;
            break;
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
    algo.rgbMapStepCount = function(width, height)
    {
      var steps = algo.getDegrees();

      if (steps == 360){ // if going all around the hue circle
        return 359;
      }
      else { //going form Start to End and back -1.
        return steps*2-1;
      }
    };

    algo.getDegrees = function (){
      var degrees;
      if (algo.Direction == "Clockwise"){ // 0 to 360
        if (algo.HueEnd > algo.HueStart){
          degrees = algo.HueEnd-algo.HueStart;
        }
        else if (algo.HueEnd < algo.HueStart) {
          degrees = algo.HueEnd-algo.HueStart+360;
        }
        else { // Hues are the same
          degrees = 360;
        }
      }
      else { // is Anti-Clockwise
        if (algo.HueEnd > algo.HueStart){
          degrees = algo.HueStart-algo.HueEnd+360;
        }
        else if (algo.HueEnd < algo.HueStart) {
          degrees = algo.HueStart-algo.HueEnd;
        }
        else { // Hues are the same
          degrees = 360;
        }
      }
      return degrees;
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
    QRgb=0x65CA7B; //Error Code 111 222 123
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
