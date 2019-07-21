let infoWindowZIndex = 10;

async function fetchImageUrl(messageId) {
  return fetch(`/message?messageId=${messageId}`)
    .then(response => response.json())
    .then(message => message.imageUrl);
}

function buildMapImage(imageUrl, infoWindow, map) {
  return `<img
            src=${imageUrl}
            class="map-image border"
            onload="${infoWindow.open(map)}"/>`;
}

// Builds and returns HTML elements that show an editable textbox and a submit button
function buildInfoWindowInput(location, imageUrl, infoWindow, map) {
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('infoWindow-content');
  // containerDiv.classList.add('d-inline-grid');
  containerDiv.innerHTML = buildMapImage(imageUrl, infoWindow, map);
  containerDiv.innerHTML += `<div class="text-center mt-2 mb-0">
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
async function createInfoWindows(map, lat, lng, location, imageUrl) {
  // eslint-disable-next-line no-undef
  const infoWindow = new google.maps.InfoWindow({
    disableAutoPan: true,
  });
  infoWindow.setContent(buildInfoWindowInput(location, imageUrl, infoWindow, map));
  infoWindow.setPosition({ lat, lng });

  return infoWindow;
}

// Fetches markers from the backend and adds them to the map
async function fetchLocations() {
  return fetch('/mapLocations').then(response => response.json());
}

function handleLocationError(map, browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : "Error: Your browser doesn't support geolocation.");
  infoWindow.open(map);
}

function centerMap(map) {
  // eslint-disable-next-line no-undef
  const infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        map.setZoom(3);
      },
      () => {
        handleLocationError(map, true, infoWindow, map.getCenter());
      },
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function createMap() {
  // eslint-disable-next-line no-undef
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 1.3483,
      lng: 103.681,
    },
    zoom: 3,
  });

  centerMap(map);
  fetchLocations().then((locations) => {
    locations.forEach((location) => {
      fetchImageUrl(location.messageIds[0])
        .then(imageUrl => createInfoWindows(map, location.lat,
          location.lng, location.location, imageUrl));
    });
  });
}

// eslint-disable-next-line no-unused-vars
function buildUI() {
  createMap();
}
