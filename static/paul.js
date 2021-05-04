console.log("paul.js loaded");
console.log("-_-_-_-_-_-_-_-_-_-_-_-");

// I. IMPORT SOME DATA

  // A. import data about the 427 or so units (parks) in the NationalPark System.

var NPSData = {};
// natParksFinal.csv contains
// Code
// Name
// Latitude
// Longitude
// Acres
// att_2011
// att_2012
// att_2013
// att_2014
// att_2015
// att_2016
// att_2017
// att_2018
// att_2019
// att_2020
// att_Average

var NPSplaceRandomLatLong;


// d3.json(route.then).then(function (NPSData) {
  // do all the same stuff I do below
// });


d3.csv("resources/natParksFinal.json").then(function (NPSData) {
  // Cast strings to numbers for each record in NPSData
  NPSData.forEach(function (data) {
    data.Latitude = +data.Latitude;
    data.Longitude = +data.Longitude;
    data.Acres = +data.Acres;
    data.att_2011 = +data.att_2011;
    data.att_2012 = +data.att_2012;
    data.att_2013 = +data.att_2013;
    data.att_2014 = +data.att_2014;
    data.att_2015 = +data.att_2015;
    data.att_2016 = +data.att_2016;
    data.att_2017 = +data.att_2017;
    data.att_2018 = +data.att_2018;
    data.att_2019 = +data.att_2019;
    data.att_2020 = +data.att_2020;
    data.att_Average = +data.att_Average;
  });

  // set a variable that stores how many records there are in this dataset:
  NPSplaceCount = NPSData.length;
  console.log(`natParksFinal.json: ${NPSplaceCount} records`);
  // console.log(NPSData);
 
  // pick a number at random to pull that record from this dataset:
  NPSplaceRandom = Math.floor(Math.random() * NPSplaceCount);

  // retrieve the lat and long from this record and put it into an array:
  NPSplaceRandomLatLong = [NPSData[NPSplaceRandom].Latitude, NPSData[NPSplaceRandom].Longitude];
  
  console.log(`${NPSplaceRandom} ${NPSData[NPSplaceRandom].Code}
    ${NPSData[NPSplaceRandom].Name}
    ${Math.round(NPSData[NPSplaceRandom].Acres)} acres
    ${NPSplaceRandomLatLong} lat long
  `);
console.log(NPSData[NPSplaceRandom].Latitude);
console.log(NPSData[NPSplaceRandom].Longitude);

console.log(`starting the function to send ${NPSData[NPSplaceRandom].Name} to label div in HTML.`);
// print the name of the NPS unit chosen at random to the HTML
window.onload = function(){
  document.getElementById('label').innerHTML = NPSData[NPSplaceRandom].Name;
};
console.log(`${NPSData[NPSplaceRandom].Name} sent to label div in HTML.`);


  // console.log(`NPSplaceRandomLatLong[0] contains ${NPSplaceRandomLatLong[0]}`);
  // console.log(`NPSplaceRandomLatLong[1] contains ${NPSplaceRandomLatLong[1]}`);
  console.log("-_-_-_-_-_-_-_-_-_-_-_-");



  // B. import points of interest dataset

  var POIData = "";
  // filteredPoints.csv
  // OBJECTID
  // Name
  // Type
  // Latitude
  // Longitude

  d3.csv("filteredPoints.csv").then(function (POIData) {

    // Cast strings to numbers for each record in NPSData
    POIData.forEach(function (data) {
      data.lat = +data.Latitude;
      data.long = +data.Longitude;
    });
    // look at POIData
    console.log(`filteredPoints.CSV: ${POIData.length} records (points of interest). Here's one that has nothing to do with ${NPSData[NPSplaceRandom].Name}:`);
    console.log(POIData[ Math.floor(Math.round(Math.random() * POIData.length)) + 1 ]);
   
  });


    // pass the lat long coordinates of the place chosen at random from NSP places into a new variable, centerLatLong, for mapmaking.
    centerLatLong = NPSplaceRandomLatLong;



    // II. CONCENTRIC CIRCLES
      // IIA. HOW BIG?
    // The idea is to let website visitors pick the size of concentric circles around a place on the map.

    // People get how wide a circle is, so that's what we should let them choose.
    // (This does so at random, for the moment.)
    // ******
    var maxDiameter = 100;
    var diameter = Math.floor(Math.round((Math.random() * maxDiameter)))+1;
    // console.log(`The circle is set to have a ${diameter}-mile diameter.`);
    // ******

    // Radius is not so relatable, but it's how JS and Leaflet do the math.
    // Here I'm calling radius miles.
    miles = diameter / 2;
    var diameterInFeet = Math.round((diameter * 5280));
    miles = Math.round((diameter * 10)) / 10;

    // Tell the visitor how big the outer circle is--for now, console.log:
    outerCircleDims = `The outer circle is ${diameter} miles (${diameterInFeet} feet) in diameter, or about `;
    console.log(outerCircleDims);

      // IIB. HOW MANY DELAWARES IS THAT?
    // All of this evaluates diameter against common dimensions,
    // from smallest (the height of a person) to largest (the length of Delaware)
    // and picks the best one.

    // If there are more than 100 of something, use a larger dimension.
    // This sets that threshold of 100 in a way we can change if needed.
    var maxCommonObjects = 100;

      if (diameterInFeet / 5.5 < maxCommonObjects) {
        // 5.5 ft
        scaleText = `${Math.round((diameterInFeet / 5.5))} <a href="https://www.cdc.gov/nchs/data/nhsr/nhsr122-508.pdf" target="_blank">people</a> across, if they lay down head to toe.`;
      }

      else if (diameterInFeet / 35 < maxCommonObjects) {
        // 35 ft
        scaleText = `${Math.round((diameterInFeet / 35))} <a href="https://www.trackschoolbus.com/blog/what-is-the-average-size-of-a-school-bus/" target = "_blank">school buses</a> across.`;
      }
      else if (diameterInFeet / 231.3 < maxCommonObjects) {
        // 231.3 ft
        scaleText = `${Math.round((diameterInFeet / 231.3))} <a href="https://en.wikipedia.org/wiki/Boeing_747" target="_blank">747s</a> across.`;
      }
      else if (diameterInFeet / 1063 < maxCommonObjects) {
        // 1063 ft
        scaleText = `${Math.round((diameterInFeet / 1063))} <a href="https://en.wikipedia.org/wiki/Eiffel_Tower" target="_blank">Eiffel Towers</a> across (if you could lay the Eiffel Tower on its side).`;
      }
      else if ((diameterInFeet / (13.4 * 5280)) < maxCommonObjects) {
        // 13.4 miles
        scaleText = `${Math.round((diameterInFeet / (13.4 * 5280)))} <a href="https://en.wikipedia.org/wiki/Manhattan" target="_blank">islands of Manhattan</a> across.`;
      }
      else {
        // 96 miles
        scaleText = `${Math.round((diameterInFeet / (96 * 5280)))} <a href="https://en.wikipedia.org/wiki/Delaware" target="_blank">Delawares</a> aross.`;
      };
      console.log(scaleText);

    console.log("-_-_-_-_-_-_-_-_-_-_-_-");


      // IIC. HOW MANY CONCENTRIC CIRCLES TO PLOT?
    // We said we'd give visitors variable to change (probably with a drop-down)
    // that specifies how many concentric circles there should be.
    // (Just for the moment, it's choosing a value at random.)

    // ******
    var divisions = 4
    // var divisions = Math.round(Math.random() * 5) + 1
    console.log(`If there's more than one circle, there will be ${divisions} of them.`);
    // ******

    // Radius starts at zero, but, when code gets to the loop that makes concentric circles,
    // radius will iterate by radiusIncrements up to the limit set in miles.
    var radius = 0;

    // how many miles apart is one concentric circle from the next?
    var radiusIncrements = miles / divisions;
    circleText = `Each circle will be ${Math.round(radiusIncrements * 10) / 10} miles (${Math.round(radiusIncrements * 5280)} feet) from the next, or about ${Math.round(radiusIncrements * 20)} minutes walk.`;
    // console.log(circleText);


      // IID. HOW DOES DIAMETER RELATE TO ZOOM LEVEL?
    // This sets a zoom level to start.
    // In the long switch statement below, value are added to this.

    
    // This sets maximum zoom level for all tile layers
    var maxZoomLevel = 22;
    console.log("-_-_-_-_-_-_-_-_-_-_-_-");

var zoom = 3
    // Here's an if-then statement that sets zoom level based on the radius of the outermost circle, set in the variable miles.
    // It deserves further refinement.
    if (diameter < 20) {
      zoom = 11;
    }

    else if (diameter < 50) {
      zoom = 9;
    }

    else if (diameter < 100) {
      zoom = 8;
    }

    else if (diameter < 200) {
      zoom = 7;
    }

    else if (diameter < 300) {
      zoom = 6;
    }

    else if (diameter < 600) {
      zoom = 5;
    }
    
    else if (diameter < 1000) {
      zoom = 4;
    };

    console.log(`${diameter} mile Ø`);
    console.log(`zoom level ${zoom}`);

        // print a statement about scale to the HTML
        window.onload = function(){
          document.getElementById('scale').innerHTML =  "<i>starting zoom level: " + zoom + "</i><br>" + outerCircleDims + scaleText + "<br>" + circleText;
        };
        console.log("Scale text sent to scale div in HTML.");
    
    

    // I made a table of what size circle fit well at what zoom level on my computer.
    // It would be different based on a device's screen resolution, as well as what percent of the browser window the map takes up,
    // but the real point is to avoic being zoomed so far in that the visitor only sees one circle, or none at all,
    // and thinks it's broken.
    // zoom   mile radius
    //  2      5000
    //  3      2500
    //  4      1000      ******
    //  5       750
    //  6       400
    //  7       200
    //  8       100      ******
    //  9        50
    // 10        25
    // 11        10      ******
    // 12         7
    // 13         3
    // 14         1.5    ******
    // 15         0.75
    // 16         0.35
    // 17         0.2
    // 18         0.1    ******
    // 19         0.05
    // 20         0.025
    // 21         0.0125 ******
    // 22         0.00625
    // 23         0.005


// Now we have to switch gears and make a map in order to have a map to plot circles on.
    // IIIA. MAKE A MAP

    // all the MapBox styles are at https://docs.mapbox.com/api/maps/styles/#mapbox-styles
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: maxZoomLevel,
      id: "satellite-v9",
      accessToken: API_KEY
    });

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: maxZoomLevel,
      id: "dark-v10",
      accessToken: API_KEY
    });

    var streets = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: maxZoomLevel,
      id: "streets-v11",
      accessToken: API_KEY
    });

    var baseMaps = {
      Satellite: satellite,
      Dark: dark,
      Streets: streets
    };

    // console.log(`center lat long: ${centerLatLong}`);

    var ctrLatitude = NPSplaceRandomLatLong[0];
    // console.log(ctrLatitude);
    var ctrLongitude = NPSplaceRandomLatLong[1];
    // console.log(ctrLongitude);

    // Create a map object. Here's where zoom is:
    var myMap = L.map("map", {
      center: NPSplaceRandomLatLong,
      zoom: zoom,
      layers: [satellite]
// add to the array in line 156 the other layers I want: parks and points of interest


    });
    // console.log("map object created");

    // Add the tile layer.
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 22,
      zoomOffset: -1,
      // I've just been commenting in and out different map views here.
      // id: "mapbox/streets-v11",
      // id: "mapbox/dark-v10",
      id: "mapbox/satellite-v9",

      // API key
      accessToken: API_KEY
    }).addTo(myMap);

    // console.log("Added a tile layer, read in the API key, and set the map view.");

    console.log("-_-_-_-_-_-_-_-_-_-_-_-");

    // This draws a line around the world along the 45th parallel north...
    var parallel = [
      [45.00, -180],
      [45.00, 180]
    ];
    L.polyline(parallel, {
      color: "red",
      weight: "0.75"
    }).addTo(myMap);


    // œuf de Pâques
    var axeHistorique = [
      [48.890171, 2.243282],
      [48.861613, 2.333366]
    ];
    L.polyline(axeHistorique, {
      color: "lightblue",
      weight: "2"
    }).addTo(myMap);


    // ...the equator...    
    var parallel = [
      [0, -180],
      [0, 180]
    ];
    L.polyline(parallel, {
      color: "#9999ff",
      weight: "0.75"
    }).addTo(myMap);


    // ...and the 45th parallel south.
    var parallel = [
      [-45.00, -180],
      [-45.00, 180]
    ];
    L.polyline(parallel, {
      color: "red",
      weight: "0.75"
    }).addTo(myMap);

    // console.log("Drew a blue line around the world at the equator and red lines around the world at the 45th parallels north and south");
    // console.log("-_-_-_-_-_-_-_-_-_-_-_-");



    // IIE. PICK COLORS AND PLOT CIRCLES ON THE MAP
    // Color is the color of the *boundary* of the concentric circle.
Color = "#ffffff";

// fillColor is the color of the *interior* of the concentric circle.
var fillColor = Color;

// If we have allow multiple map views more than satellite view,
// we'll want to test and determine different optimal opacities for each view
// and set them here:
var opacity = 0.05;
console.log(`color: ${Color}, fillColor: ${fillColor}, opacity: ${opacity}`);

// If someone wants to see a circle with a diameter of less than a mile,
// this draws only one circle...
if (diameter <= 1) {
    L.circle(centerLatLong, {
        color: Color,
        fillColor: fillColor,
        fillOpacity: opacity,
        radius: miles * 1609.34
        }).addTo(myMap);

        console.log(`Drew ${Math.round(miles*2*5280)}-foot diameter circle enclosing an area of ${Math.round(miles*miles*Math.PI)} square miles (${Math.round(miles*miles*Math.PI*27878400)} square feet) around the center point`);
    };
console.log(`checked whether largest circle (${miles}-mile radius) was greater than one mile and plotted circles accordingly.`);

// ...but if someone wants to see a circle with a radius of a mile or more,
// draw concentric circles:
if (diameter > 1) {

    // console.log(`Started running a loop to draw concentric circles out to ${miles} miles around the center point.s`);

    for ( radius = 0 + radiusIncrements; radius <= miles;) {

        // Create a circle and give it attributes
        L.circle(centerLatLong, {
          color: Color,
          fillColor: fillColor,
          fillOpacity: opacity,
          radius: radius * 1609.34
        }).addTo(myMap);
        // console.log(`Drew concentric circle ${Math.round((radius * 2) * 10 ) / 10} miles across.`);

        // console.log(`color: ${Color} opacity: ${opacity}`);
        radius = radius + radiusIncrements;
        };
        // console.log(`Finished running the concentric circles loop.`);
    };

console.log("-_-_-_-_-_-_-_-_-_-_-_-");




// IIIB. BIND MARKERS TO MAP FOR EACH NPS UNIT ("PARK")

// NPSplaceCount stores how many records there are in our dataset of NPS units:

  // This loops through the array called places and creates one marker for each place,
  // then binds a popup containing that place's info and adds it to the map.

  for (var i = 0; i < NPSplaceCount; i++) {
    var unit = NPSData[i];

    unitSearchName = "";
    unitName = "";
    unitVisitors = "";
    unitAcres = "";
    unitVisitorsPerAcre = "";
    
    unitSearchName = unit.Name.replace(/ /g, '+');
    unitName = `<a href=http://www.google.com/search?q="${unitSearchName}" target="_blank">${unit.Name}</a>`;

    unitAcres = `${Math.round((unit.Acres) * 10) / 10} acres`;

    if (unit.att_Average > 0) {
      unitVisitors = `${unit.att_Average} visitors each year<br>`;
      unitVisitorsPerAcre = `${Math.round((unit.att_Average / unit.Acres) * 10 ) / 10} visitors per acre each year`;
    }
    else if (unit.att_Average = 0) {
      unitVisitors = "attendance data not available";
      unitVisitorsPerAcre = "";
    };

    // console.log(unit.Code);
    // console.log(unit.Latitude);
    // console.log(unit.Longitude);
    // console.log(visitors);

    L.marker([unit.Latitude, unit.Longitude], title = unit.Name)
    .bindPopup("<h3>" + unitName + "</h3>" + "<h4>" + unitVisitors + unitAcres + "<br>" + unitVisitorsPerAcre + "</h4>")
    .addTo(myMap);
    // console.log(`marked ${i+1}`);
  };

console.log(`Popups bound to markers and placed on map.`);

console.log("-_-_-_-_-_-_-_-_-_-_-_-");


});