// Development tool access
var testAlgo;

(

  function() {
    var algo = ();
    algo.apiVersion = 2;
    algo.name = "Color Complement";
    algo.author = "Rick McGuire";
    algo.acceptColors = 1; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
    algo.properties = [];

    /**************************************************
    * Custom Property Definition
    */
    algo.HueOffset = 30;
    algo.properties.push("name:HueOffset|type:range|display:Hue Offset|values:0,90|write:setHueOffset|read:getHueOffset");

    /**
    * Custom Property Getter and Setter methods
    */
    algo.setHueOffset = function(setHueOffsetValue) {
      algo.HueOffset = setHueOffsetValue*1;
    };

    algo.getHueOffset = function() {
      return "" + algo.HueOffset;
    };

    /**************************************************
    * Custom Property Definition
    */
    algo.NumBase = 2;
    algo.properties.push("name:NumBase|type:range|display:Pixels of Base Color|values:1,99|write:setNumBase|read:getNumBase");

    /**
    * Custom Property Getter and Setter methods
    */
    algo.setNumBase = function(setNumBaseValue) {
      algo.NumBase = setNumBaseValue*1;
    };

    algo.getNumBase = function() {
      return "" + algo.NumBase;
    };

    /**************************************************
    * Custom Property Definition
    */
    algo.NumSecondary = 1;
    algo.properties.push("name:NumSecondary|type:range|display:Pixels of Secondary Color|values:1,99|write:setNumSecondary|read:getNumSecondary");

    /**
    * Custom Property Getter and Setter methods
    */
    algo.setNumSecondary = function(setNumSecondaryValue) {
      algo.NumSecondary = setNumSecondaryValue*1;
    };

    algo.getNumSecondary = function() {
      return "" + algo.NumSecondary;
    };

    /**************************************************
    * Custom Property Definition
    */
    algo.Direction = "Left";
    algo.properties.push("name:Direction|type:list|display:Direction|values:Left,Right|write:setDirection|read:getDirection");

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
    algo.rgbMap = function(width, height, rgb, step) {
      var HSV = QRgbToHSV(rgb);
      //Create the HSV for the color
      var h, s, v;
      h = HSV.H;
      s = HSV.S;
      v = HSV.V;

      var scheme = algo.SplitComplementaryScheme(h, algo.HueOffset);
      var i = step % (algo.NumBase + algo.NumSecondary + algo.NumBase + algo.NumSecondary);
      var pos, posDelta;

      //Set Scrolling Direction
      if (algo.Direction == "Left") {
        posDelta = 1;
      }
      if (algo.Direction == "Right") {
        posDelta = -1;
      }
      //create empty map
      var map = new Array(height);
      for (var y = 0; y < height; y++) {
        map[y] = [];
        pos = i;
        for (var x = 0; x < width; x++) {
          if (pos < algo.NumBase) {
            map[y][x] = HSVToQRgb(scheme.base, s, v);
            pos += posDelta;
          } else if (pos < algo.NumBase + algo.NumSecondary) {
            map[y][x] = HSVToQRgb(scheme.secondaryUp, s, v);
            pos += posDelta;
          } else if (pos < algo.NumBase + algo.NumSecondary + algo.NumBase) {
            map[y][x] = HSVToQRgb(scheme.base, s, v);
            pos += posDelta;
          } else if (pos < algo.NumBase + algo.NumSecondary + algo.NumBase + algo.NumSecondary) {
            map[y][x] = HSVToQRgb(scheme.secondaryDown, s, v);
            pos += posDelta;
          }
          if (pos >= algo.NumBase + algo.NumSecondary + algo.NumBase + algo.NumSecondary) {
            pos = 0;
          }
          if (pos < 0) {
            pos = algo.NumBase + algo.NumSecondary + algo.NumBase + algo.NumSecondary - 1;
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
      // All pixels in the map must be used exactly once, each one separately
      // at a time. Therefore, the maximum number of steps produced by this
      // script on a 5 * 5 grid is 25.
      return 2 * (algo.NumBase + algo.NumSecondary);
      //width * height;
    };

    /*
    * @return an object containg {base,secondaryUp, secondaryDown,complement}
    */
    algo.SplitComplementaryScheme = function(h, offset) {

      //secondaryUp
      secondaryUp = ((h + 180 - offset) % 360 + 360) % 360;
      //secondaryDown
      secondaryDown = ((h + 180 + offset) % 360 + 360) % 360;
      //Complement
      complement = ((h + 180) % 360 + 360) % 360;

      return {
        base: h,
        secondaryUp: secondaryUp,
        secondaryDown: secondaryDown,
        complement: complement
      };
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
  return (r << 16) + (g << 8) + b;
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
