// Development tool access
var testAlgo;

(

  function() {
    var algo = {};
    algo.apiVersion = 2;
    algo.name = "Gradient Generator v2";
    algo.author = "Rick McGuire";

    util = {}; //holder object for algorithm data

    algo.acceptColors = 1; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
    algo.properties = [];

    /**
     * Custom Property Definition - GradientMode
     */
    algo.GradientMode = "RGB";
    algo.properties.push("name:GradientMode|type:list|display:GradientMode|values:RGB,HSV,HSV-Clockwise,HSV-CounterClockwise|write:setGradientMode|read:getGradientMode");

    /**
     * Custom Property Getter and Setter methods
     * Sets the mode the gradient is calculated over.
     */
    algo.setGradientMode = function(_GradientModeValue) {
      algo.GradientMode = _GradientModeValue;
    };

    algo.getGradientMode = function() {
      return algo.GradientMode;
    };

    /**
     * Custom Property - Orientation
     * The direction the ser color will move.
     */
    algo.Orientation = "Horizontal";
    algo.properties.push("name:Orientation|type:list|display:Orientation|values:Horizontal,Vertical|write:setOrientation|read:getOrientation");

    algo.setOrientation = function(_OrientationValue) {
      algo.Orientation = _OrientationValue;
    };

    algo.getOrientation = function() {
      return algo.Orientation;
    };

    /**
     * Custom Property Definition - Colour_1_Red
     */
    algo.Colour_1 = "FF0000";
    algo.properties.push("name:Colour_1|type:string|display:Colour1|write:setColour_1|read:getColour_1");

    /**
     * Custom Property Getter and Setter methods
     */
    algo.setColour_1 = function(_Colour_1_Value) {
      algo.Colour_1 = _Colour_1_Value;
    };

    algo.getColour_1 = function() {
      return algo.Colour_1;
    };

    /**
     * Custom Property Definition - Colour_1_Red
     */
    algo.Colour_2 = "0000FF";
    algo.properties.push("name:Colour_2|type:string|display:Colour2|values:|write:setColour_2|read:getColour_2");

    /**
     * Custom Property Getter and Setter methods
     */
    algo.setColour_2 = function(_Colour_2_Value) {
      algo.Colour_2 = _Colour_2_Value;
    };

    algo.getColour_2 = function() {
      return algo.Colour_2;
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

      //Calculate the Gradient Colours
      var Colour;

      //set the number of gradient steps.
      var steps = 0;
      switch (algo.Orientation) {
        case "Horizontal":
          steps = width;
          break;
        case "Vertical":
          steps = height;
          break;
        default:
          steps = width;
      }

      switch (algo.GradientMode) {
        case "RGB":
          Colour = util.getGradientRGB(steps);
          break;
        case "HSV":
          Colour = util.getGradientHSV(steps);
          break;
        case "HSV-Clockwise":
          Colour = util.getGradientHSVClockwise(steps);
          break;
        case "HSV-CounterClockwise":
          Colour = util.getGradientHSVCounterClockwise(steps);
          break;
        default:
          Colour = util.getGradientRGB(steps);
      }

      var map = new Array(height);

      for (var y = 0; y < height; y++) {
        map[y] = [];
        for (var x = 0; x < width; x++) {
          switch (algo.Orientation) {
            case "Horizontal":
              map[y][x] = Colour[x];
              break;
            case "Vertical":
              map[y][x] = Colour[y];
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
    algo.rgbMapStepCount = function(width, height) {
      // All pixels in the map must be used exactly once, each one separately
      // at a time. Therefore, the maximum number of steps produced by this
      // script on a 5 * 5 grid is 25.
      switch (algo.Orientation) {
        case "Horizontal":
          return 1;
        case "Vertical":
          return 1;
      }

      return null;
    };

    /**
     * =========================================
     * Gradient Functions
     * =========================================
     */

    /**
     * getGradientRGB
     * @param steps - the number of steps to take
     * @returns an array of QRgb values
     */
    util.getGradientRGB = function(steps) {

      /*
      ** Determine Colours from Hex
      */
      var Colour_1_RGB = util.hexToRgb(algo.Colour_1);
      var Colour_1_Red = Colour_1_RGB.Red;
      var Colour_1_Green = Colour_1_RGB.Green;
      var Colour_1_Blue = Colour_1_RGB.Blue;

      var Colour_2_RGB = util.hexToRgb(algo.Colour_2);
      var Colour_2_Red = Colour_2_RGB.Red;
      var Colour_2_Green = Colour_2_RGB.Green;
      var Colour_2_Blue = Colour_2_RGB.Blue;

      //Handle special cases for steps
      if (steps <= 0) {
        return null;
      }
      var gradientColours = new Array(steps);

      if (steps == 1) {
        gradientColours[0] = RGBToQRgb(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
        return gradientColours;
      }

      if (steps == 2) {
        gradientColours[0] = RGBToQRgb(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
        gradientColours[1] = RGBToQRgb(Colour_2_Red, Colour_2_Green, Colour_2_Blue);
        return gradientColours;
      }

      //Handle General Case

      for (var i = 0; i < steps; i++) {
        // value = Colour 1 + Current Step * (Colour 2 - Colour 1)/ (steps-1)
        var tempRed = Math.floor(Colour_1_Red + i * (Colour_2_Red - Colour_1_Red) / (steps - 1));
        var tempGreen = Math.floor(Colour_1_Green + i * (Colour_2_Green - Colour_1_Green) / (steps - 1));
        var tempBlue = Math.floor(Colour_1_Blue + i * (Colour_2_Blue - Colour_1_Blue) / (steps - 1));
        gradientColours[i] = RGBToQRgb(tempRed, tempGreen, tempBlue);
      }
      return gradientColours;
    };

    /**
     * getGradientHSV
     * @param steps - the number of steps to take
     * @returns an array of QRgb values
     */
    util.getGradientHSV = function(steps) {

      /*
      ** Determine Colours from Hex
      */
      var Colour_1_RGB = util.hexToRgb(algo.Colour_1);
      var Colour_1_Red = Colour_1_RGB.Red;
      var Colour_1_Green = Colour_1_RGB.Green;
      var Colour_1_Blue = Colour_1_RGB.Blue;

      var Colour_2_RGB = util.hexToRgb(algo.Colour_2);
      var Colour_2_Red = Colour_2_RGB.Red;
      var Colour_2_Green = Colour_2_RGB.Green;
      var Colour_2_Blue = Colour_2_RGB.Blue;

      /*
      ** Calculeate the Differnce in Hues to Determine if gradient should be clockwise or anti clockwise.
      ** which ever is shorter.
      */
      var tempColour1 = RGBToHSV(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
      var tempColour2 = RGBToHSV(Colour_2_Red, Colour_2_Green, Colour_2_Blue);
      var diff = tempColour2.H - tempColour1.H; //work out diffence in hues

      //find the shortest direction and return the result.
      var gradientColours;
      if (diff<=180 & diff>=-180) {
        if (diff >= 0) {
          gradientColours = util.getGradientHSVClockwise(steps);
        } else {
          gradientColours = util.getGradientHSVCounterClockwise(steps);
        }
      } else {
        if (diff > 180) {
          gradientColours = util.getGradientHSVCounterClockwise(steps);
        } else {
          gradientColours = util.getGradientHSVClockwise(steps);
        }
      }

      return gradientColours;
    };

    /**
     * getGradientHSVClockwise
     * @param steps - the number of steps to take
     * @returns an array of QRgb values
     */
    util.getGradientHSVClockwise = function(steps) {

      /*
      ** Determine Colours from Hex
      */
      var Colour_1_RGB = util.hexToRgb(algo.Colour_1);
      var Colour_1_Red = Colour_1_RGB.Red;
      var Colour_1_Green = Colour_1_RGB.Green;
      var Colour_1_Blue = Colour_1_RGB.Blue;

      var Colour_2_RGB = util.hexToRgb(algo.Colour_2);
      var Colour_2_Red = Colour_2_RGB.Red;
      var Colour_2_Green = Colour_2_RGB.Green;
      var Colour_2_Blue = Colour_2_RGB.Blue;

      //Handle special cases for steps
      if (steps <= 0) {
        return null;
      }
      var gradientColours = new Array(steps);

      if (steps == 1) {
        gradientColours[0] = RGBToQRgb(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
        return gradientColours;
      }

      if (steps == 2) {
        gradientColours[0] = RGBToQRgb(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
        gradientColours[1] = RGBToQRgb(Colour_2_Red, Colour_2_Green, Colour_2_Blue);
        return gradientColours;
      }

      //Handle General Case
      var tempColour1 = RGBToHSV(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
      var tempColour2 = RGBToHSV(Colour_2_Red, Colour_2_Green, Colour_2_Blue);

      for (var i = 0; i < steps; i++) {
        // value = Colour 1 + Current Step * (Colour 2 - Colour 1)/ (steps-1)
        var tempHue = tempColour1.H + i * ((((tempColour2.H - tempColour1.H) % 360) + 360) % 360) / (steps - 1);
        var tempSat = tempColour1.S + i * (tempColour2.S - tempColour1.S) / (steps - 1);
        var tempVal = tempColour1.V + i * (tempColour2.V - tempColour1.V) / (steps - 1);
        gradientColours[i] = HSVToQRgb(tempHue, tempSat, tempVal);
      }
      return gradientColours;
    };

    /**
     * getGradientHSVCounterClockwise
     * @param steps - the number of steps to take
     * @returns an array of QRgb values
     */
    util.getGradientHSVCounterClockwise = function(steps) {

      /*
      ** Determine Colours from Hex
      */
      var Colour_1_RGB = util.hexToRgb(algo.Colour_1);
      var Colour_1_Red = Colour_1_RGB.Red;
      var Colour_1_Green = Colour_1_RGB.Green;
      var Colour_1_Blue = Colour_1_RGB.Blue;

      var Colour_2_RGB = util.hexToRgb(algo.Colour_2);
      var Colour_2_Red = Colour_2_RGB.Red;
      var Colour_2_Green = Colour_2_RGB.Green;
      var Colour_2_Blue = Colour_2_RGB.Blue;

      //Handle special cases for steps
      if (steps <= 0) {
        return null;
      }
      var gradientColours = new Array(steps);

      if (steps == 1) {
        gradientColours[0] = RGBToQRgb(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
        return gradientColours;
      }

      if (steps == 2) {
        gradientColours[0] = RGBToQRgb(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
        gradientColours[1] = RGBToQRgb(Colour_2_Red, Colour_2_Green, Colour_2_Blue);
        return gradientColours;
      }

      //Handle General Case

      var tempColour1 = RGBToHSV(Colour_1_Red, Colour_1_Green, Colour_1_Blue);
      var tempColour2 = RGBToHSV(Colour_2_Red, Colour_2_Green, Colour_2_Blue);

      for (var i = 0; i < steps; i++) {
        // value = Colour 1 + Current Step * (Colour 2 - Colour 1)/ (steps-1)
        var tempHue = tempColour1.H - i * ((((tempColour1.H - tempColour2.H) % 360) + 360) % 360) / (steps - 1);
        var tempSat = tempColour1.S + i * (tempColour2.S - tempColour1.S) / (steps - 1);
        var tempVal = tempColour1.V + i * (tempColour2.V - tempColour1.V) / (steps - 1);
        gradientColours[i] = HSVToQRgb(tempHue, tempSat, tempVal);
      }
      return gradientColours;
    };

    //TODO move to Color Functions
    /**
     * getGradientHSVCounterClockwise
     * @param hex - string as hex
     * @returns an array of ??? values
     */
    util.hexToRgb = function(hex) {
      //CHECK BOUNDS ON HEX INPUT

      if (hex === undefined){
        hex = "FFFFFF";
      }

      if (hex.length > 6){
        hex = "FFFFFF";
      }

      var bigint = parseInt(hex, 16);

      return {
        Red: (bigint >> 16) & 255,
        Green: (bigint >> 8) & 255,
        Blue: bigint & 255
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
  return (r << 16) + (g << 8) + (b << 0);
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
