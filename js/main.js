var $colorPalette = document.querySelector('.color-palette');
var $paletteGradient = document.querySelector('.palette-gradient');
var $newProjectRGBCode = document.querySelectorAll('[data-type="new-project-RGB-code"]');
var $newPaletteButton = document.querySelector('.new-palette-button');
var $projectEntryForm = document.querySelector('#new-project-form');
var $colorSearch = document.querySelector('#color-search');
var $projectsList = document.querySelector('.projects-list');
var $detailsModal = document.querySelector('#details-modal');
var $exit = document.querySelector('.exit');
var $dataView = document.querySelectorAll('[data-view]');
var $newAnchor = document.querySelector('.new-anchor');
var $projectsAnchor = document.querySelector('.projects-anchor');
var $modalCheckmark = document.querySelector('.modal-checkmark');
var $projectName = document.querySelector('#project-name');
var $projectDetails = document.querySelector('#project-details');
var $projectDeadline = document.querySelector('#project-deadline');
var $formTitle = document.querySelector('.new-project-styling');
var $modalEdit = document.querySelector('.modal-edit-icon');
var $formCheckmark = document.querySelector('.form-checkmark');
var $formCompleted = document.querySelector('.form-completed');
var $deleteButton = document.querySelector('.delete-button');
var $cancelModal = document.querySelector('#cancel-modal');
var $modalDeleteButton = document.querySelector('.modal-delete-button');
var $modalNoButton = document.querySelector('.modal-no-button');
var $modalCompleted = document.querySelector('.completed');
var $loadingSpinnerTop = document.querySelector('#loading-spinner-top');
var $loadingSpinnerBottom = document.querySelector('#loading-spinner-bottom');
var $networkModal = document.querySelector('#network-modal');
var $networkExit = document.querySelector('.network-exit');
var $projectsPlaceholderText = document.querySelector('.projects-paceholder-text');

$newPaletteButton.addEventListener('click', handleNewPaletteButtonClick);
$colorSearch.addEventListener('change', colorSearch);
$projectEntryForm.addEventListener('submit', saveProject);
document.addEventListener('DOMContentLoaded', handleDomContentLoaded);
$projectsList.addEventListener('click', handlePolaroidClicks);
$exit.addEventListener('click', closeDetails);
$newAnchor.addEventListener('click', handleNewClik);
$projectsAnchor.addEventListener('click', handleProjectsClick);
$modalEdit.addEventListener('click', handleModalEdit);
$formCheckmark.addEventListener('click', handleFormCompleted);
$deleteButton.addEventListener('click', handleDeleteButton);
$modalDeleteButton.addEventListener('click', handleModalDeleteButton);
$modalNoButton.addEventListener('click', handleModalNoButton);
$modalCheckmark.addEventListener('click', handleModalCompleted);
$networkExit.addEventListener('click', handleNetworkExitClick);

function handleNewPaletteButtonClick(event) {
  event.preventDefault();
  data.colorPalette = {};
  data.search = false;
  getColors();
}

function getColors(rgb) {
  $loadingSpinnerTop.className = 'row';
  $loadingSpinnerBottom.className = 'row';
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
    $loadingSpinnerTop.className = 'row hidden';
    $loadingSpinnerBottom.className = 'row hidden';
    setColorPalette(data.colorPalette, $colorPalette);
    setRgbCodes(data.colorPalette, $newProjectRGBCode);
    setGradient(data.colorPalette, $paletteGradient);

  });
  xhr.addEventListener('error', function () {
    $networkModal.className = 'modal-background';
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

function setRgbCodes(paletteColors, element) {
  for (var i = 0; i < paletteColors.length; i++) {
    element[i].textContent = '(' + paletteColors[i][0] + ', ' + paletteColors[i][1] + ', ' + paletteColors[i][2] + ')';
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

  var $li = document.querySelectorAll('li');

  var projectNameInput = $projectEntryForm.elements.projectName.value;
  var projectDetailsInput = $projectEntryForm.elements.projectDetails.value;
  var projectDeadlineInput = $projectEntryForm.elements.projectDeadline.value;

  var newProjectEntry = {
    projectName: projectNameInput,
    projectDetails: projectDetailsInput,
    projectDeadline: projectDeadlineInput,
    colorPalette: data.colorPalette
  };

  if (data.editing !== null) {
    newProjectEntry.completed = data.editing.completed;
    newProjectEntry.entryId = data.editing.entryId;
    for (var i = 0; i < data.entries.length; i++) {
      if (data.editing.entryId === data.entries[i].entryId) {
        data.entries[i] = newProjectEntry;
      }
    }
    for (var a = 0; a < $li.length; a++) {
      var entryId = $li[a].getAttribute('data-entry-id');
      var dataEntryId = parseInt(entryId);
      if (dataEntryId === data.editing.entryId) {
        var createdProject = renderProjectEntry(newProjectEntry);
        $li[a].replaceWith(createdProject);
      }
    }
  } else {
    newProjectEntry.completed = false;
    newProjectEntry.entryId = data.nextEntryId;
    data.nextEntryId++;
    data.entries.unshift(newProjectEntry);
    var renderedProjectEntry = renderProjectEntry(newProjectEntry);
    $projectsList.prepend(renderedProjectEntry);
  }

  if (data.entries.length > 0) {
    $projectsPlaceholderText.className = 'projects-paceholder-text text-align-center hidden';
  }

  data.colorPalette = {};
  $projectEntryForm.reset();
  viewSwap('projects');
}

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
  //     <div class="row justify-space-between">
  //        <p class="polaroid-title">Hulu Website Update</p>
  //        <i class="fa-solid fa-pencil polaroid-edit-icon"></i>
  //      </div>
  //     <p class="polaroid-date">Due: Deptember 2, 2022</p>
  //     <i class="polaroid-checkmark">&#10004;</i>
  //     <br></br>
  //     <i class="fa-solid fa-ellipsis ellipsis"></i>
  //   </div>
  // </li>

  var liElement = document.createElement('li');
  liElement.setAttribute('data-entry-id', project.entryId);
  liElement.className = 'column-one-third column-one-half polaroid-spacing';

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

  var row = document.createElement('div');
  row.className = 'row justify-space-between';
  backgroundDiv.appendChild(row);

  var titleP = document.createElement('p');
  titleP.className = 'polaroid-title';
  titleP.textContent = project.projectName;
  row.appendChild(titleP);

  var editIcon = document.createElement('i');
  editIcon.className = 'fa-solid fa-pencil polaroid-edit-icon';
  row.appendChild(editIcon);

  var dateP = document.createElement('p');
  dateP.className = 'polaroid-date';
  dateP.textContent = 'Deadline: ' + convertDateFormat(project.projectDeadline);
  backgroundDiv.appendChild(dateP);

  var checkmark = document.createElement('i');
  checkmark.className = 'polaroid-checkmark';
  checkmark.innerHTML = '&#10004;';
  if (project.completed === false) {
    checkmark.style.color = 'rgb(212, 209, 209)';
  } else if (project.completed === true) {
    checkmark.style.color = 'limegreen';
  }
  backgroundDiv.appendChild(checkmark);

  var br = document.createElement('br');
  backgroundDiv.appendChild(br);

  var ellipsisI = document.createElement('i');
  ellipsisI.className = 'fa-solid fa-ellipsis ellipsis';
  backgroundDiv.appendChild(ellipsisI);

  return liElement;
}

function handleDomContentLoaded(event) {
  if (data.entries.length > 0) {
    $projectsPlaceholderText.className = 'projects-paceholder-text text-align-center hidden';
    for (var i = 0; i < data.entries.length; i++) {
      var newProject = renderProjectEntry(data.entries[i]);
      $projectsList.appendChild(newProject);
    }
  }

  viewSwap(data.view);

  $deleteButton.className = 'delete-button hidden';
}

function handlePolaroidClicks(event) {
  var closestProject = event.target.closest('li');
  var projectID = closestProject.getAttribute('data-entry-id');
  projectID = parseInt(projectID);
  for (var i = 0; i < data.entries.length; i++) {
    if (projectID === data.entries[i].entryId) {
      if (event.target.matches('.ellipsis')) {
        showProjectDetails(data.entries[i]);
        data.editing = data.entries[i];
      }
      if (event.target.matches('.polaroid-checkmark')) {
        handleCompleted(event.target, data.entries[i]);
      }
      if (event.target.matches('.polaroid-edit-icon')) {
        data.editing = data.entries[i];
        data.colorPalette = data.entries[i].colorPalette;
        handleEdit();
        viewSwap('new-project-form');
      }
    }
  }
}

function handleModalEdit() {
  handleEdit();
  viewSwap('new-project-form');
  $detailsModal.className = 'modal-background hidden';
}

function handleEdit() {
  if (data.editing !== null) {
    $projectName.value = data.editing.projectName;
    $projectDetails.value = data.editing.projectDetails;
    $projectDeadline.value = data.editing.projectDeadline;
    setColorPalette(data.editing.colorPalette, $colorPalette);
    setRgbCodes(data.editing.colorPalette, $newProjectRGBCode);
    setGradient(data.editing.colorPalette, $paletteGradient);
    $formTitle.textContent = 'Edit Project';
    $formCheckmark.className = 'form-checkmark';
    $deleteButton.className = 'delete-button';
    data.colorPalette = data.editing.colorPalette;
    if (data.editing.completed === true) {
      $formCheckmark.style.color = 'limegreen';
      $formCompleted.style.color = '#03322f';
    } else if (data.editing.completed === false) {
      $formCheckmark.style.color = 'rgb(212, 209, 209)';
    }
  }
}

function handleFormCompleted(event) {
  if (data.editing.completed === false) {
    data.editing.completed = true;
    $formCheckmark.style.color = 'limegreen';
    $formCompleted.style.color = '#03322f';
  } else if (data.editing.completed === true) {
    data.editing.completed = false;
    $formCheckmark.style.color = 'rgb(212, 209, 209)';
    $formCompleted.style.color = 'rgb(212, 209, 209)';
  }
}

function handleModalCompleted(event) {
  if (data.editing.completed === false) {
    data.editing.completed = true;
    $modalCheckmark.style.color = 'limegreen';
    $modalCompleted.style.color = '#03322f';
  } else if (data.editing.completed === true) {
    data.editing.completed = false;
    $modalCheckmark.style.color = 'rgb(212, 209, 209)';
    $modalCompleted.style.color = 'rgb(212, 209, 209)';
  }
}

function handleCompleted(target, data) {
  if (data.completed === false) {
    data.completed = true;
    target.style.color = 'limegreen';
  } else if (data.completed === true) {
    data.completed = false;
    target.style.color = 'rgb(212, 209, 209)';
  }
}

function showProjectDetails(data) {
  $detailsModal.className = 'modal-background';

  var $detailsProjectTitle = document.querySelector('.project-title-modal');
  $detailsProjectTitle.textContent = data.projectName;

  var $detailsDate = document.querySelector('.due-date-modal');
  $detailsDate.textContent = 'Deadline: ' + convertDateFormat(data.projectDeadline);

  var $completed = document.querySelector('.completed');
  if (data.completed === true) {
    $modalCheckmark.style.color = 'limegreen';
    $completed.style.color = '#03322f';
  } else if (data.completed === false) {
    $modalCheckmark.style.color = 'rgb(212, 209, 209)';
    $completed.style.color = 'rgb(212, 209, 209)';
  }

  var $projectDetails = document.querySelector('.project-details-modal');
  $projectDetails.textContent = data.projectDetails;

  var $detailsColorPalette = document.querySelector('.modal-palette');
  setColorPalette(data.colorPalette, $detailsColorPalette);

  var $detailsRGBCode = document.querySelectorAll('[data-type="details-RGB-code"]');
  setRgbCodes(data.colorPalette, $detailsRGBCode);

  var $detailsGradient = document.querySelector('.modal-gradient');
  setGradient(data.colorPalette, $detailsGradient);
}

function closeDetails(event) {
  for (var i = 0; i < data.entries.length; i++) {
    if (data.entries[i].entryId === data.editing.entryId) {
      var index = i;
      if (data.editing.completed === true) {
        data.entries[i].completed = true;
      } else if (data.editing.completed === false) {
        data.entries[i].completed = false;
      }
    }
  }

  var entries = document.querySelectorAll('[data-entry-id]');

  for (var x = 0; x < entries.length; x++) {
    if (parseInt(entries[x].getAttribute('data-entry-id')) === data.editing.entryId) {
      var updatedEntry = renderProjectEntry(data.entries[index]);
      entries[x].replaceWith(updatedEntry);
    }
  }

  $detailsModal.className = 'modal-background hidden';
  data.editing = null;
}

function viewSwap(view) {
  for (var i = 0; i < $dataView.length; i++) {
    if (view === $dataView[i].getAttribute('data-view')) {
      $dataView[i].className = 'view';
      data.view = view;
    } else {
      $dataView[i].className = 'view hidden';
    }
  }
}

function handleNewClik(event) {
  getColors();
  $formTitle.textContent = 'New Project';
  $formCheckmark.className = 'form-checkmark hidden';
  $deleteButton.className = 'delete-button hidden';
  data.editing = null;
  $projectEntryForm.reset();
  viewSwap('new-project-form');
}

function handleProjectsClick(event) {
  viewSwap('projects');
}

function handleDeleteButton(event) {
  $cancelModal.className = 'modal-background';
}

function handleModalNoButton(event) {
  $cancelModal.className = 'modal-background hidden';
}

function handleModalDeleteButton(event) {
  for (var i = 0; i < data.entries.length; i++) {
    if (data.editing.entryId === data.entries[i].entryId) {
      data.entries.splice(i, 1);
      break;
    }
  }
  var entries = document.querySelectorAll('[data-entry-id]');

  for (var x = 0; x < entries.length; x++) {
    if (parseInt(entries[x].getAttribute('data-entry-id')) === data.editing.entryId) {
      entries[x].remove();
    }
  }
  data.editing = null;
  $cancelModal.className = 'modal-background hidden';
  viewSwap('projects');
  if (data.entries.length === 0) {
    $projectsPlaceholderText.className = 'projects-paceholder-text text-align-center';
  }

}

function handleNetworkExitClick(event) {
  $networkModal.className = 'modal-background hidden';
}
