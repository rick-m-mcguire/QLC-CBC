/*
  Q Light Controller Plus
  devtool.js

  Copyright (c) Heikki Junnila

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

var webUtil = {};

function init()
{
    var w = document.getElementById("width");
    var h = document.getElementById("height");

    if (!w.value)
        w.value = 15;
    if (!h.value)
        h.value = 15;

    webUtil.properties = [];

    updateProperties();
    loadCustomProperties();
    updateCustomPropertiesList();
    updateStepCount();
    writeCurrentStep();

}

function updateStepCount()
{
    var w = document.getElementById("width");
    var h = document.getElementById("height");
    var stepCount = document.getElementById("stepcount");
    var currentStep = document.getElementById("currentstep");

    if (w && h && stepCount && currentStep)
    {
        stepCount.value = testAlgo.rgbMapStepCount(w.value, h.value);
        currentStep.value = -1;
        nextStep();
        updateProperties();
    }
    else
    {
        alert("Width, Height or Result element not found!");
    }
}

function updateProperties()
{
    var apiVersion = document.getElementById("apiversion");
    var name = document.getElementById("name");
    var author = document.getElementById("author");

    if (apiVersion)
        apiVersion.value = testAlgo.apiVersion;
    if (name)
        name.value = testAlgo.name;
    if (author)
        author.value = testAlgo.author;
}

function loadCustomProperties()
{
  var NumProperties = testAlgo.properties.length;
  if(NumProperties == 0){
      return null; // exit function
  }
  var curProperty;
  for (i=0; i < NumProperties; i++)
  {
    curProperty = testAlgo.properties[i];
    webUtil.properties[i] = new Array(getPropertyDisplay(curProperty), getPropertyName(curProperty), getPropertyRead(curProperty), getPropertyWrite(curProperty));
  }

  var HTML ="";
  for (i=0; i < NumProperties; i++)
  {
    HTML = HTML + webUtil.properties[i][0] +": <INPUT TYPE=\"text\" ID=\""+ webUtil.properties[i][1] +"\"  SIZE=\"3\" onChange=\"updateCustomProperties()\"/>" + "<br>";
  }
  HTML = HTML + "<INPUT TYPE=\"button\" value=\"Update\" onClick=\"updateCustomProperties()\"/><BR>";
  document.getElementById("AlgorithmCustomProperties").innerHTML = HTML;
}

function updateCustomPropertiesList()
{
  var NumProperties = webUtil.properties.length;
  if(NumProperties == 0){
      return null; // exit function
  }

  var code = "";
  for (i=0; i < NumProperties; i++)
  {
    code = "var "+webUtil.properties[i][1]+" = document.getElementById(\""+webUtil.properties[i][1]+"\");";
    eval(code);
    code = ""+webUtil.properties[i][1]+".value = testAlgo."+webUtil.properties[i][2]+"();"
    eval(code);
  }
}

function updateCustomProperties(){
  var NumProperties = webUtil.properties.length;
  if(NumProperties == 0){
      return null; // exit function
  }

  var code = "";
  for (i=0; i < NumProperties; i++)
  {
    code = "var "+webUtil.properties[i][1]+" = document.getElementById(\""+webUtil.properties[i][1]+"\");";
    eval(code);
    code = "testAlgo."+webUtil.properties[i][3]+"(parseInt("+webUtil.properties[i][1]+".value)"+ ");";
    eval(code);
  }
  updateStepCount(); //reset RGBmatrix
}

function getPropertyDisplay(textProperties)
{
  var start = textProperties.indexOf("display:");
  textProperties = textProperties.slice(start,textProperties.length);
  var start = textProperties.indexOf(":");
  textProperties = textProperties.slice(start+1,textProperties.length);
  var end = textProperties.indexOf("|");
  textProperties = textProperties.slice(0,end);

  return textProperties;
}

function getPropertyWrite(textProperties)
{
  var start = textProperties.indexOf("write:");
  textProperties = textProperties.slice(start,textProperties.length);
  var start = textProperties.indexOf(":");
  textProperties = textProperties.slice(start+1,textProperties.length);
  var end = textProperties.indexOf("|");
  textProperties = textProperties.slice(0,end);

  return textProperties;
}

function getPropertyRead(textProperties)
{
  var start = textProperties.indexOf("read:");
  textProperties = textProperties.slice(start,textProperties.length);
  var start = textProperties.indexOf(":");
  textProperties = textProperties.slice(start+1,textProperties.length);
  var end = textProperties.indexOf("|"); //there is no last pipe
  textProperties = textProperties.slice(0,textProperties.length);

  return textProperties;
}

function getPropertyName(textProperties)
{
  var start = textProperties.indexOf("name:");
  textProperties = textProperties.slice(start,textProperties.length);
  var start = textProperties.indexOf(":");
  textProperties = textProperties.slice(start+1,textProperties.length);
  var end = textProperties.indexOf("|");
  textProperties = textProperties.slice(0,end);

  return textProperties;
}

function nextStep()
{
    var stepCount = document.getElementById("stepcount");
    var currentStep = document.getElementById("currentstep");

    if (stepCount && currentStep)
    {
        var steps = parseInt(stepCount.value);
        var current = parseInt(currentStep.value);

        var next;
        if ((current + 1) < steps)
            next = current + 1;
        else
            next = 0;

        currentStep.value = next;
        writeCurrentStep();
    }
    else
    {
        alert("stepcount or currentstep element not found!");
    }
}

function previousStep()
{
    var stepCount = document.getElementById("stepcount");
    var currentStep = document.getElementById("currentstep");

    if (stepcount && currentStep)
    {
        var steps = parseInt(stepCount.value);
        var current = parseInt(currentStep.value);

        var next;
        if (current > 0)
            next = current - 1;
        else
            next = steps - 1;

        currentStep.value = next;
        writeCurrentStep();
    }
    else
    {
        alert("stepcount or currentstep element not found!");
    }
}

function writeCurrentStep()
{
    var map = document.getElementById("map");
    var w = document.getElementById("width");
    var h = document.getElementById("height");
    var currentStep = document.getElementById("currentstep");
    var stepCount = document.getElementById("stepcount");
    var bicolor = document.getElementById("bicolor");

    var currentRgb = parseInt(document.getElementById("color1").value, 16);

    if (bicolor.checked)
    {
        var stepCountMinusOne = parseInt(stepCount.value) - 1;
        stepCountMinusOne = stepCountMinusOne == 0 ? 1 : stepCountMinusOne;
        var currentR = ((stepCountMinusOne - parseInt(currentStep.value)) / stepCountMinusOne) * 255;
        var currentG = 0;
        var currentB = (parseInt(currentStep.value) / stepCountMinusOne) * 255;
        currentRgb = (Math.round(currentR) * 256 * 256 + Math.round(currentG) * 256 + Math.round(currentB)).toString(16);
        currentRgb = "000000".substr(0, 6 - currentRgb.length) + currentRgb;
    }

    if (w && h && map && currentStep)
    {
        var width = parseInt(w.value);
        var height = parseInt(h.value);
        var step = parseInt(currentStep.value);

        for (var i = map.rows.length - 1; i >= 0; i--)
            map.deleteRow(i);

        var rgb = testAlgo.rgbMap(width, height, currentRgb, step);

        for (var y = 0; y < height; y++)
        {
            var row = map.insertRow(y);

            for (var x = 0; x < width; x++)
            {
                var cell = row.insertCell(x);
		var rgbStr = rgb[y][x].toString(16);
		while (rgbStr.length != 6)
		  rgbStr = "0" + rgbStr;
                cell.style.backgroundColor = rgbStr;
                cell.style.height = 20;
                cell.style.width = 20;
            }
        }
    }
    else
    {
        alert("map element not found!");
    }
}
