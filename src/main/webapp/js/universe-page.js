const LOCATION_COUNT = 5;
let infoWindows = [];
let infoWindowZIndex = 10;
let map;

async function fetchImageUrl(messageId) {
  return fetch(`/message?messageId=${messageId}`)
    .then(response => response.json())
    .then(message => message.imageUrl);
}

function buildMapImage(imageUrl, infoWindow) {
  return `<img
            src=${imageUrl}
            class="map-image border"
            onload="${infoWindow.open(map)}"/>`;
}

// Builds and returns HTML elements that show an editable textbox and a submit button
function buildInfoWindowInput(location, imageUrl, infoWindow) {
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('infoWindow-content', 'p-3');
  // containerDiv.classList.add('d-inline-grid');
  containerDiv.innerHTML = buildMapImage(imageUrl, infoWindow);
  containerDiv.innerHTML += `<div class="text-center mt-2 mb-0 location-link-container">
                              <a class="location-link" href="/feed.html?searchLabel=${location.toLowerCase()}">
                                ${location}
                              </a>
                            </div>`;

  containerDiv.onclick = () => {
    infoWindowZIndex += 1;
    infoWindow.setZIndex(infoWindowZIndex);
  };
  return containerDiv;
}

// Creates a marker that shows a read-only info window when clicked
function createInfoWindows(lat, lng, location, imageUrl) {
  // eslint-disable-next-line no-undef
  const infoWindow = new google.maps.InfoWindow({
    disableAutoPan: true,
  });
  infoWindow.setContent(buildInfoWindowInput(location, imageUrl, infoWindow));
  infoWindow.setPosition({ lat, lng });

  return infoWindow;
}

// Fetches markers from the backend and adds them to the map
async function fetchLocations() {
  return fetch(`/mapLocations?count=${LOCATION_COUNT}`).then(response => response.json());
}

function displayLocations() {
  fetchLocations().then((locations) => {
    locations.forEach((location) => {
      fetchImageUrl(location.messageIds[0])
        .then(imageUrl => infoWindows.push(createInfoWindows(location.lat,
          location.lng, location.location, imageUrl)));
    });
  });
}

function createMap() {
  // eslint-disable-next-line no-undef
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40,
      lng: 0,
    },
    zoom: 2,
  });

  displayLocations();
}

async function removeInfowindows() {
  infoWindows.forEach(info => info.close());
  infoWindows = [];
}

// eslint-disable-next-line no-unused-vars
function onClickShuffleButton() {
  removeInfowindows().then(displayLocations());
}

// eslint-disable-next-line no-unused-vars
function buildUI() {
  createMap();
}
