function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    // eslint-disable-next-line no-undef
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function buildMapImage() {
  return `<div class="map-image-container">
            <img id="map-image" 
                 class="lazy map-image border" 
                 src="images/landing-carousel/singapore.jpg" />
          </div>`;
}

// Builds and returns HTML elements that show an editable textbox and a submit button
function buildInfoWindowInput(location, messagIds) {
  const containerDiv = document.createElement('div');

  const messageId = messagIds[0];
  containerDiv.innerHTML = buildMapImage();
  containerDiv.innerHTML += `<p class="text-center">${location}</p>`;
  return containerDiv;
}

// Creates a marker that shows a read-only info window when clicked
function createInfoWindows(map, lat, lng, location, messagIds) {
  // eslint-disable-next-line no-undef
  const infoWindow = new google.maps.InfoWindow({
    content: buildInfoWindowInput(location, messagIds),
  });
  infoWindow.setPosition({ lat, lng });
  infoWindow.open(map);

  // marker.addListener('click', () => {
  //   infoWindow.open(map, marker);
  // });

  // marker.addListener('click', () => {
  //   toggleBounce(marker);
  // });
}

// Fetches markers from the backend and adds them to the map
function fetchLocations(map) {
  fetch('/mapLocations')
    .then(response => response.json())
    .then((locations) => {
      locations.forEach((location) => {
        createInfoWindows(map, location.lat, location.lng,
          location.location, location.messageIds);
      });
    });
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
    zoom: 6,
  });

  centerMap(map);

  fetchLocations(map);
}

// eslint-disable-next-line no-unused-vars
function buildUI() {
  createMap();
}




// // Creates a marker that shows a textbox the user can edit
// function createMarkerForEdit(lat, lng) {
//   // if we are already showing an editable marker, then remove it
//   if (editMarker) {
//     editMarker.setMap(null);
//   }

//   editMarker = new google.maps.Marker({
//     position: {
//       lat,
//       lng,
//     },
//     map,
//     draggable: true,
//     animation: google.maps.Animation.DROP,
//   });

//   const infoWindow = new google.maps.InfoWindow({
//     description: buildInfoWindowInput(lat, lng),
//   });

//   editMarker.addListener('click', () => {
//     infowindow.open(map, editMarker);
//   });

//   editMarker.addListener('click', toggleBounce);


//   // When the user closes the editable info window, close the marker
//   google.maps.event.addListener(infoWindow, 'closeclick', () => {
//     editMarker.setMap(null);
//   });

//   infoWindow.open(map, editMarker);
// }