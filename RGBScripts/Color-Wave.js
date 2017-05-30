/*
* How It Works:
* The algorithm fills the matrix with a spectrum of colors centered around
* the user supplied color (bounded by the Hue Range).
* The position of the user supplied color is then varied from Right/Left or Bottom/Top
*/

// Development tool access
var testAlgo;

(

	function()
	{
		var algo = {};
		algo.apiVersion = 2;
		algo.name = "Color Wave";
		algo.author = "Rick McGuire";
		algo.acceptColors = 1; // 0 - No Colours, 1 - 1 Colour, 2 - 2 Colours
		algo.properties = [];

		/**
		* Custom Property - Hue Range
		* The the how wide to distrute the spectrum.
		*/
		algo.HueRange = 180;
		algo.properties.push("name:HueRange|type:range|display:Hue Range|values:0,720|write:setHueRange|read:getHueRange");

		algo.setHueRange = function(setHueRangeValue)
		{
			algo.HueRange = setHueRangeValue;
		};

		algo.getHueRange = function()
		{
			return algo.HueRange;
		};

		/**
		* Custom Property - Hue Direction
		* The direcion to distribute the spectrum. If "both" center around the user selected color.
		*/
		algo.HueDirection = "Both";
		algo.properties.push("name:HueDirection|type:list|display:Hue Direction|values:Clockwise,Both,Anti-Clockwise|write:setHueDirection|read:getHueDirection");

		algo.setHueDirection = function(setHueDirectionValue)
		{
			algo.HueDirection = setHueDirectionValue;
		};

		algo.getHueDirection = function()
		{
			return algo.HueDirection;
		};

		/**
		* Custom Property - Orientation
		* The direction the ser color will move.
		*/
		algo.Orientation = "Horizontal";
		algo.properties.push("name:Orientation|type:list|display:Orientation|values:Horizontal,Vertical|write:setOrientation|read:getOrientation");

		algo.setOrientation = function(setOrientationValue)
		{
			algo.Orientation = setOrientationValue;
		};

		algo.getOrientation = function()
		{
			return algo.Orientation;
		};

		var util ={}; //object to store helper functions

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
			var NumPos = util.getNumPos(width, height);
			var HSV = QRgbToHSV(rgb);
			//Create the HSV for the color
			var h,s,v;
			h = HSV.H;
			s = HSV.S;
			v = HSV.V;

			var Hues = util.getHues(h,NumPos); //Calculate the hue spectrum
			var startPos = util.getStartPos(step,NumPos); //Calculate the position to start drawing

			var map = new Array(height);
			for (var y = 0; y < height; y++)
			{
				map[y] = [];
				for (var x = 0; x < width; x++)
				{
					switch (algo.Orientation) {
						case "Horizontal":
						map[y][x] = HSVToQRgb(Hues[startPos+x],s,v);
						break;
						case "Vertical":
						map[y][x] = HSVToQRgb(Hues[startPos+y],s,v);
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
			return 2*(util.getNumPos(width, height)+1)-1;
		};

		/**
		* Calculates the number of positions
		*
		* @param width The width of the map
		* @param height The height of the map
		* @return the number of starting positions the algorithm has
		*/
		util.getNumPos = function(width, height)
		{
			var value;
			switch (algo.Orientation) {
				case "Horizontal":
				value = width;
				break;
				case "Vertical":
				value = height;
				break;
			}
			return value-1;
		};

		/**
		* Calculates the Hue spectrum to be used in the algorithm
		*
		* @param h the starting hue
		* @param NumPos The number of starting positions the algorithm has
		* @return The Hue spectrum
		*/
		util.getHues = function(h, NumPos)
		{
			var Hues = new Array (2*NumPos+1);
			var firstHue, hueStep;
			var i = 0;
			switch (algo.HueDirection) {
				case "Clockwise":
				firstHue = h;
				hueStep = algo.HueRange/(NumPos);

				for(i=0; i<NumPos+1;i++){
					Hues[NumPos+i]= firstHue+hueStep*i;
					Hues[NumPos-i]=Hues[NumPos+i];
				}
				Hues[NumPos]=h; //define mid point hue
				break;

				case "Anti-Clockwise":
				firstHue = h;
				hueStep = -algo.HueRange/(NumPos);

				for(i=0; i<NumPos+1;i++){
					Hues[NumPos+i]= firstHue+hueStep*i;
					Hues[NumPos-i]=Hues[NumPos+i];
				}
				Hues[NumPos]=h; //define mid point hue
				break;

				case "Both":
				firstHue = h-(algo.HueRange/2);
				hueStep = (algo.HueRange/2)/(NumPos);

				for(i=0; i<NumPos;i++){
					Hues[i]= firstHue+hueStep*i;
				}
				Hues[NumPos]=h; //define mid point hue
				for(i=NumPos+1; i<2*NumPos+1;i++){
					Hues[i]= firstHue+hueStep*i;
				}
				break;
			}

			return Hues;
		};

		/**
		* Calculates the postion in the spectrum array to start drawing given
		* the current step.
		*
		* @param step the current RGB step
		* @param NumPos The number of starting positions the algorithm has
		* @return the postion to start drawing the current step
		*/
		util.getStartPos = function(step, NumPos)
		{
			//workout the starting pos for this step
			var pos, up, i;
			i=0;
			pos = 0;
			up = true;
			while (i!=step){
				if (up){
					pos++;
					i++;
				}
				else {
					pos--;
					i++;
				}
				if (pos>=NumPos){
					up = false;
				}
				if (pos<=-NumPos){
					up = true;
				}
			}
			return pos;
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
  return (r << 16) + (g << 8) + (b << 0); //bitwise shift blue becuase otherwise its treated as a string.
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
  return (r << 16) + (g << 8) + (b << 0); //bitwise shift blue becuase otherwise its treated as a string.
}
