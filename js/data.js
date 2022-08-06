/* exported data */
var data = {
  view: 'new-project-form',
  entries: [],
  nextEntryId: 1,
  colorPalette: [],
  search: false,
  editing: null
};

var dataJSON = localStorage.getItem('pigment-local-storage');
if (dataJSON !== null) {
  data = JSON.parse(dataJSON);
}

function saveEntryData(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('pigment-local-storage', dataJSON);

  data.editing = null;
}

window.addEventListener('beforeunload', saveEntryData);
