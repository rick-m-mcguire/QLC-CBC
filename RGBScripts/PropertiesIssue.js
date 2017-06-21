/*
  Q Light Controller Plus
  propertiesIssue.js

  Copyright (c) Rick McGuire

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0.txt

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Based upon the work of Massimo Callegari

  Copyright (c) Massimo Callegari

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0.txt

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// Development tool access
var testAlgo;

(
  function()
  {
    var algo = new Object;
    algo.apiVersion = 2;
    algo.name = "Properties Issue Demo";
    algo.author = "Rick McGuire";
    algo.properties = new Array();


    /*
    **************************************
    List
    **************************************
    */

    algo.myList = "Horizontal"; //param
    algo.properties.push("name:myList|type:list|display:myList|values:Horizontal,Vertical|write:setmyList|read:getmyList");

    algo.setmyList = function(_myList)
    {
  	   algo.myList = _myList;
    }

    algo.getmyList = function()
    {
        return algo.myList;
    }

    /*
    **************************************
    Range
    **************************************
    */

    algo.myRange = 0; //param
    algo.properties.push("name:myRange|type:range|display:myRange|values:0,10|write:setmyRange|read:getmyRange");

    algo.setmyRange = function(_myRange)
    {
       algo.myRange = parseInt(_myRange);
    }

    algo.getmyRange = function()
    {
        return algo.myRange;
    }

    /*
    **************************************
    Integer
    **************************************
    */

    algo.myinteger = 0; //param
    //algo.properties.push("name:myInteger|type:integer|display:myInteger|write:setmyInteger|read:getmyInteger"); //leave out values: pair as it doesnt apply to integer
    //algo.properties.push("name:myInteger|type:integer|display:myInteger||write:setmyInteger|read:getmyInteger"); //empty space for vales as it doest apply to integer.
    //algo.properties.push("name:myInteger|type:integer|display:myInteger|values:|write:setmyInteger|read:getmyInteger"); //add a blank values:
    algo.properties.push("name:myInteger|type:integer|display:myInteger|values: |write:setmyInteger|read:getmyInteger"); //add a values:[space]
    //algo.properties.push("name:myInteger|type:integer|display:myInteger|values:0,10|write:setmyInteger|read:getmyInteger"); //maybe values is needed? use range format

    algo.setmyInteger = function(_myInteger)
    {
       algo.myinteger = parseInt(_myInteger);
    }

    algo.getmyInteger = function()
    {
        return algo.myinteger;
    }

    /*
    **************************************
    String
    **************************************
    */

    algo.myString = "String"; //param
    //algo.properties.push("name:myString|type:string|display:myString|write:setmyStr|read:getmyStr");  //leave out values: pair as it doesnt apply to strings
    //algo.properties.push("name:myString|type:string|display:myString||write:setmyStr|read:getmyStr");  //empty space for vales as it doest apply to strings.
    //algo.properties.push("name:myString|type:string|display:myString|values:|write:setmyStr|read:getmyStr"); //add a blank values:
    algo.properties.push("name:myString|type:string|display:myString|values: |write:setmyStr|read:getmyStr"); //add a values:[space]
    //algo.properties.push("name:myString|type:string|display:myString|values:6|write:setmyStr|read:getmyStr"); //maybe values is a lenght? values:6

    algo.setmyStr = function(_myStr)
    {
       algo.myString = "" +_myStr;
    }

    algo.getmyStr = function()
    {
        return algo.myString;
    }

    algo.rgbMap = function(width, height, rgb, step)
    {
	  var map = new Array(height);
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

    algo.rgbMapStepCount = function(width, height)
    {
	     return width * height;
    }

    // Development tool access
    testAlgo = algo;

    return algo;
    }
)()
