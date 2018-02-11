// Development tool access
var testAlgo;

(

  function()
  {
    var algo = {};
    algo.apiVersion = 2;
    algo.name = "Flash";
    algo.author = "Rick McGuire";
    algo.acceptColors = 1; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
    algo.properties = [];
    util = {}; //holder object for algorithm data
    util.created = false;
    util.width = 0;
    util.height= 0;
    util.stepMap = [];

    /**
    * Custom Property Getter and Setter methods
    */
    algo.NumFixtures = 10;
    algo.properties.push("name:NumFixtures|type:range|display:Number of Fixtures|values:1,40|write:setNumFixtures|read:getNumFixtures");

    algo.setNumFixtures = function(setNumFixturesValue)
    {
      util.created = false;
      algo.NumFixtures = parseInt(setNumFixturesValue);
    };

    algo.getNumFixtures = function()
    {
      return algo.NumFixtures;
    };

    /**
    * Custom Property Getter and Setter methods
    */
    algo.NumFadeSteps = 10;
    algo.properties.push("name:NumFadeSteps|type:range|display:Number of Fade Steps|values:1,40|write:setNumFadeSteps|read:getNumFadeSteps");

    algo.setNumFadeSteps = function(setNumFadeStepsValue)
    {
      util.created = false;
      algo.NumFadeSteps = parseInt(setNumFadeStepsValue);
    };

    algo.getNumFadeSteps = function()
    {
      return algo.NumFadeSteps;
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
      util.create(width,height);
      var color = QRgbToHSV(rgb);
      var x, y, z;
      //create a blank stepMap
      map = new Array(height);
      for(y=0;y<height;y++)
      {
        map[y] = new Array(width);
        for (x=0;x<width;x++)
        {
          map[y][x] = HSVToQRgb(color.H,color.S,util.stepMap[y][x][step]);
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
      // All pixels in the map must be used exactly once, each one separately
      // at a time. Therefore, the maximum number of steps produced by this
      // script on a 5 * 5 grid is 25.
      util.create(width,height);
      return 1000;
      //width * height;
    };

    /**
    * Description
    *
    * @param variable - Description
    * @return Description
    */
    util.create = function(width, height)
    {
      //check if created map matches current dimentions
      if ((util.width==width) & (util.height==height) & (util.created))
      {
        return null;
      }
      //create map
      util.created = true;

      //update map dimentions
      util.width = width;
      util.height = height;

      var steps = algo.rgbMapStepCount(width,height);
      var x, y, z;
      //create a blank stepMap
      util.stepMap = new Array(height);
      for(y=0;y<height;y++)
      {
        util.stepMap[y] = new Array(width);
        for (x=0;x<width;x++)
        {
          util.stepMap[y][x] = new Array(steps);
          for(z=0;z<steps;z++)
          {
            util.stepMap[y][x][z] = 0;
          }
        }
      }

      //Draw
      var time, drawing, modeTime;
      for(y=0;y<height;y++)
      {
        for (x=0;x<width;x++)
        {
          time = 0;
          mode = "Waiting";
          modeTime = Math.floor(Math.random()*algo.NumFadeSteps*width*height/algo.NumFixtures);
          while (time < (steps))
          {
            if (mode == "Waiting")
            {
              time = time + modeTime; // jump time to when mode time would = 0
              modeTime = 0;
            }
            else
            {
              //draw flash
              util.stepMap[y][x][time] = 1-(algo.NumFadeSteps-modeTime)/algo.NumFadeSteps;
              time++;
              modeTime--;
            }

            //calculate next mode time
            if(modeTime === 0)
            {
              switch (mode) {
                case "Drawing":
                  mode = "Waiting";
                  modeTime = Math.floor(Math.random()*algo.NumFadeSteps*width*height/algo.NumFixtures);
                  break;
                case "Waiting":
                  mode = "Drawing";
                  modeTime = algo.NumFadeSteps;
                break;
              }
            }
          }
        }
      }
    };

    /**
    * Description
    *
    * @param variable - Description
    * @return Description
    */
    util.name = function(width, height)
    {
      return null;
    };

    /**
    * Description
    *
    * @param variable - Description
    * @return Description
    */
    util.name = function(width, height)
    {
      return null;
    };

    /**
    * Description
    *
    * @param variable - Description
    * @return Description
    */
    util.name = function(width, height)
    {
      return null;
    };

    // Development tool access
    testAlgo = algo;

    return algo;
  }
)();

/**
 * =========================================
 * Colour Functions
 * =========================================
 */

//----------------- RGB TO -----------------

/**
 * RGBToQRgb
 * Converts a R, G, B values to a QRgb
 * @param r - the amount of Red 0-255
 * @param g - the amount of Green 0-255
 * @param b - the amount of Blue 0-255
 * @returns a QRgb value for the colour
 */
function RGBToQRgb(r, g, b) {
    return (r << 16) + (g << 8) + (b << 0); //bitwise shift blue becuase otherwise its treated as a string.
}

/**
 * RGBToHSV
 * Converts a R, G, B values to a H, S, V values
 * Adapted from https://www.rapidtables.com/convert/color/rgb-to-hsv.html
 * @param r - the amount of Red 0-255
 * @param g - the amount of Green 0-255
 * @param b - the amount of Blue 0-255
 * @returns an Object Containing {H,S,V} for the colour
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
 * QRgbToRGB
 * Converts a QRgb value to a R, G, B values
 * @param QRgb - the QRgb representing the colour
 * @returns an Object containing {Red, Green, Blue} for the colour
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
 * QRgbToHSV
 * Converts a QRgb value to a H, S, V values
 * Adapted from https://www.rapidtables.com/convert/color/rgb-to-hsv.html
 * @param QRgb - the QRgb representing the colour
 * @returns an Object Containing {H,S,V} for the colour
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
 * HSVToRGB
 * Converts a H, S, V values to R, G, B values
 * Adapted from https://www.cs.rit.edu/~ncs/color/t_convert.html
 * @param H - Hue
 * @param S - Saturation
 * @param V - Value
 * @returns an Object containing {Red, Green, Blue} for the colour
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
        // chroma (colour)
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
 * HSVToQRgb
 * Converts a H, S, V values to QRgb values
 * Adapted from https://www.cs.rit.edu/~ncs/color/t_convert.html
 * @param H - Hue
 * @param S - Saturation
 * @param V - Value
 * @returns an Object containing {Red, Green, Blue} for the colour
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
        // chroma (colour)
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
    return (r << 16) + (g << 8) + (b << 0); //bitwise shift blue becuase otherwise its treated as a string.
}
