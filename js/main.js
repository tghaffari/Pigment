var $colorPalette = document.querySelector('.color-palette');
var $paletteGradient = document.querySelector('.palette-gradient');
var $rgbCode = document.querySelectorAll('.rgb-code');
var $newPaletteButton = document.querySelector('.new-palette-button');
var $projectEntryForm = document.querySelector('#new-project-form');
var $colorSearch = document.querySelector('#color-search');
var $projectsList = document.querySelector('.projects-list');

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
    setColorPalette(data.colorPalette, $colorPalette);
    setRgbCodes(data.colorPalette);
    setGradient(data.colorPalette, $paletteGradient);
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

function setColorPalette(paletteColors, element) {
  element.style.background = 'linear-gradient(' +
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

function setGradient(paletteColors, element) {
  element.style.background = 'linear-gradient(' +
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
  projectDeadlineInput = convertDateFormat(projectDeadlineInput);

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

  var renderedProjectEntry = renderProjectEntry(newProjectEntry);
  $projectsList.prepend(renderedProjectEntry);
  getColors('rrggbb');
  $projectEntryForm.reset();
}

$projectEntryForm.addEventListener('submit', saveProject);

function convertDateFormat(dateString) {
  var dateInputArray = dateString.split('-');
  var months = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
  var monthIndex = parseInt(dateInputArray[1]) - 1;
  var date = months[monthIndex] + ' ' + dateInputArray[2] + ', ' + dateInputArray[0];
  return date;
}

function renderProjectEntry(project) {
  // <li class="column-one-third polaroid-spacing">
  //   <div class="polaroid-background">
  //     <i class="fa-solid fa-thumbtack pin"></i>
  //     <div class="polaroid-gradient"></div>
  //     <p class="polaroid-title">Hulu Website Update</p>
  //     <p class="polaroid-date">Due: Deptember 2, 2022</p>
  //     <i class="fa-solid fa-ellipsis ellipsis"></i>
  //   </div>
  // </li>

  var liElement = document.createElement('li');
  liElement.className = 'column-one-third polaroid-spacing';

  var backgroundDiv = document.createElement('div');
  backgroundDiv.className = 'polaroid-background';
  liElement.appendChild(backgroundDiv);

  var iPin = document.createElement('i');
  iPin.className = 'fa-solid fa-thumbtack pin';
  backgroundDiv.appendChild(iPin);

  var gradientDiv = document.createElement('div');
  gradientDiv.className = 'polaroid-gradient';
  setGradient(project.colorPalette, gradientDiv);
  backgroundDiv.appendChild(gradientDiv);

  var titleP = document.createElement('p');
  titleP.className = 'polaroid-title';
  titleP.textContent = project.projectName;
  backgroundDiv.appendChild(titleP);

  var dateP = document.createElement('p');
  dateP.className = 'polaroid-date';
  dateP.textContent = 'Deadline: ' + project.projectDeadline;
  backgroundDiv.appendChild(dateP);

  var ellipsisI = document.createElement('i');
  ellipsisI.className = 'fa-solid fa-ellipsis ellipsis';
  backgroundDiv.appendChild(ellipsisI);

  return liElement;

}

function handleDomContentLoaded(event) {
  for (var i = 0; i < data.entries.length; i++) {
    var newProject = renderProjectEntry(data.entries[i]);
    $projectsList.appendChild(newProject);
  }
}
document.addEventListener('DOMContentLoaded', handleDomContentLoaded);
