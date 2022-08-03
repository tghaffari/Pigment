/* exported data */
var data = {
  view: 'new-project-form',
  entries: [],
  nextEntryId: 1,
  randomColorPalette: []
};

var dataJSON = localStorage.getItem('pigment-local-storage');
if (dataJSON !== null) {
  data = JSON.parse(dataJSON);
}

function saveEntryData(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('pigment-local-storage', dataJSON);
}

window.addEventListener('beforeunload', saveEntryData);
