var $colorPalette = document.querySelector('.color-palette');
var $paletteGradient = document.querySelector('.palette-gradient');
var $rgbCode = document.querySelectorAll('.rgb-code');
var $newPaletteButton = document.querySelector('.new-palette-button');
var $projectEntryForm = document.querySelector('#new-project-form');
var $colorSearch = document.querySelector('#color-search');

$newPaletteButton.addEventListener('click', handleNewPaletteButtonClick);
$colorSearch.addEventListener('change', colorSearch);

function handleNewPaletteButtonClick(event) {
  event.preventDefault();
  data.colorPalette = {};
  data.search = false;
  getColors();
}

function getColors(rgb) {
  var targetUrl = encodeURIComponent('http://colormind.io/api/');
  if (data.search === false) {
    var body = {
      model: 'default'
    };
  } else if (data.search === true) {
    body = {
      input: [rgb, 'N', 'N', 'N', 'N'],
      model: 'default'
    };
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.colorPalette = xhr.response.result;
    setColorPalette(data.colorPalette);
    setRgbCodes(data.colorPalette);
    setGradient(data.colorPalette);
  });
  xhr.send(JSON.stringify(body));
}

getColors();

function colorSearch(event) {
  var hex = event.target.value;
  data.search = true;
  hexToRGB(hex);
  data.search = false;
}

function hexToRGB(hex) {
  var hexNoHash = hex.slice(1);
  var r = hexNoHash.slice(0, 2);
  var g = hexNoHash.slice(2, 4);
  var b = hexNoHash.slice(4);
  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  var rgb = [r, g, b];
  getColors(rgb);
}

function generateCssStringRGB(red, green, blue, x, y) {
  var rgbString = 'rgb(' + red + ',' + green + ',' + blue + ') ' + x + '% ' + y + '%';
  return rgbString;
}

function setColorPalette(paletteColors) {
  $colorPalette.style.background = 'linear-gradient(' +
  0.25 + 'turn,' +
  generateCssStringRGB(paletteColors[0][0], paletteColors[0][1], paletteColors[0][2], '0', '20') + ',' +
  generateCssStringRGB(paletteColors[1][0], paletteColors[1][1], paletteColors[1][2], '0', '40') + ',' +
  generateCssStringRGB(paletteColors[2][0], paletteColors[2][1], paletteColors[2][2], '0', '60') + ',' +
  generateCssStringRGB(paletteColors[3][0], paletteColors[3][1], paletteColors[3][2], '0', '80') + ',' +
  generateCssStringRGB(paletteColors[4][0], paletteColors[4][1], paletteColors[4][2], '0', '90') + ')';
}

function setRgbCodes(paletteColors) {
  for (var i = 0; i < paletteColors.length; i++) {
    $rgbCode[i].textContent = '(' + paletteColors[i][0] + ', ' + paletteColors[i][1] + ', ' + paletteColors[i][2] + ')';
  }
}

function setGradient(paletteColors) {
  $paletteGradient.style.background = 'linear-gradient(' +
  0.25 + 'turn,' +
  generateCssStringRGB(paletteColors[0][0], paletteColors[0][1], paletteColors[0][2], '0', '15') + ',' +
  generateCssStringRGB(paletteColors[1][0], paletteColors[1][1], paletteColors[1][2], '25', '35') + ',' +
  generateCssStringRGB(paletteColors[2][0], paletteColors[2][1], paletteColors[2][2], '45', '55') + ',' +
  generateCssStringRGB(paletteColors[3][0], paletteColors[3][1], paletteColors[3][2], '65', '75') + ',' +
  generateCssStringRGB(paletteColors[4][0], paletteColors[4][1], paletteColors[4][2], '85', '90') + ')';
}

function saveProject(event) {
  event.preventDefault();

  var projectNameInput = $projectEntryForm.elements.projectName.value;
  var projectDetailsInput = $projectEntryForm.elements.projectDetails.value;
  var projectDeadlineInput = $projectEntryForm.elements.projectDeadline.value;
  var newProjectEntry = {
    projectName: projectNameInput,
    projectDetails: projectDetailsInput,
    projectDeadline: projectDeadlineInput,
    colorPalette: data.colorPalette
  };
  newProjectEntry.entryId = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(newProjectEntry);
  data.colorPalette = {};

  getColors();
  $projectEntryForm.reset();
}

$projectEntryForm.addEventListener('submit', saveProject);
