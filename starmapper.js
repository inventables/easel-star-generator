// Define a properties array that returns array of objects representing
// the accepted properties for your application
var properties = [
  {type: 'range', id: "Points", value: 5, min: 3, max: 20, step: 1},
  {type: 'range', id: "Inner-Radius", value: 40, min: 0, max: 140, step: 1},
];

// Define an executor function that generates a valid SVG document string,
// and passes it to the provided success callback, or invokes the failure
// callback if unable to do so
var executor = function(args, success, failure) {
  var params = args[0];
  var points = params["Points"];
  var iRadius = params["Inner-Radius"];


  var coordinateBuilder = function(sides, inner) {
    var coordArray = [];
    var outerRad = 150;
    var innerRad = inner;

    const pi = Math.PI;
    var centerX = outerRad;
    var centerY = outerRad;

    var currentX;
    var currentY;

    var tempArray = [];
    var innerArray = [];
    var combinedArray = [];
    var stepAngleRadians = ((2*pi) / sides);
    var angleOffset = 0;
    var smallOffset = 0;

    // set angle offset
    if (sides === 4 || sides === 3) {
      angleOffset = stepAngleRadians/2;
    }
    else {
      angleOffset = pi / 2;
    }
    smallOffset = angleOffset + (stepAngleRadians / 2);

    // Outer Coordinates
    for (var i = angleOffset; i < ((2*pi) + angleOffset); i += stepAngleRadians) {
      currentX = centerX + (Math.cos(i) * outerRad);
      currentY = centerY - (Math.sin(i) * outerRad);

      tempArray.push([String(currentX), String(currentY)].join(","));
    }

    // Inner Coordinates
    for (var t = smallOffset; t < ((2*pi) + smallOffset); t += stepAngleRadians) {
      currentSmallX = centerX + (Math.cos(t) * innerRad);
      currentSmallY = centerY - (Math.sin(t) * innerRad);

      innerArray.push([String(currentSmallX), String(currentSmallY)].join(","));
    }

    for (var p = 0; p < innerArray.length; p++) {
      combinedArray.push(tempArray[p]);
      combinedArray.push(innerArray[p]);
    }

    return combinedArray;

  };
  var rotation = 0;
  if (points === 3) {
    rotation = 210;
  }
  else if (points === 4) {
    rotation = 45;
  }
  var svgHeader = '<?xml version="1.0" standalone="no"?> <svg xmlns="http://www.w3.org/2000/svg" version="1.0" ';
  var svgTail = '" transform="rotate(' + rotation + ' 150 150)" style="fill:#7f7f7f;stroke:#7998B6;stroke-width:4" /></svg>';
  var svg = [svgHeader + 'width="300" height="300">',
    '<polygon points="' + coordinateBuilder(points, iRadius).join(" ") +
    svgTail
  ].join("");

  success(svg);
};
