
function getColors() {
  var xhr = new XMLHttpRequest();
  xhr.open('FETCH', 'http://www.colourlovers.com/api/palettes/random');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // eslint-disable-next-line no-console
    console.log(xhr.status);
    // eslint-disable-next-line no-console
    console.log(xhr.response);
  });
  xhr.send();
}

getColors();
