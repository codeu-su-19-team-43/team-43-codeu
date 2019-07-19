let map;
// let editMarker; // Editable marker that displays when a user clicks in the map

function toggleBounce() {
  // eslint-disable-next-line no-undef
  if (marker.getAnimation() !== null) {
    // eslint-disable-next-line no-undef
    marker.setAnimation(null);
  } else {
    // eslint-disable-next-line no-undef
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// Creates a marker that shows a read-only info window when clicked
function createMarkerForDisplay(lat, lng, content) {
  // eslint-disable-next-line no-undef
  const marker = new google.maps.Marker({
    position: {
      lat,
      lng,
    },
    map,
    // eslint-disable-next-line no-undef
    animation: google.maps.Animation.DROP,
  });

  // eslint-disable-next-line no-undef
  const infoWindow = new google.maps.InfoWindow({
    content,
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });

  marker.addListener('click', toggleBounce);
}

// Fetches markers from the backend and adds them to the map
function fetchMarkers() {
  fetch('/markers')
    .then(response => response.json())
    .then((markers) => {
      markers.forEach((marker) => {
        createMarkerForDisplay(marker.lat, marker.lng, marker.content);
      });
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : "Error: Your browser doesn't support geolocation.");
  infoWindow.open(map);
}

// // Sends the marker at the backend for saving
// function postMarker(lat, lng, content) {
//   const params = new URLSearchParams();
//   params.append('lat', lat);
//   params.append('lng', lng);
//   params.append('content', content);
//   fetch('/markers', {
//     method: 'POST',
//     body: params,
//   });
// }

// // Builds and returns HTML elements that show an editable textbox and a submit button
// function buildInfoWindowInput(lat, lng) {
//   const textBox = document.createElement('textarea');
//   const button = document.createElement('button');
//   button.appendChild(document.createTextNode('Submit'));
//   button.onclick = () => {
//     createMarkerForDisplay(lat, lng, textBox.value);
//     // postMarker(lat, lng, textBox.value);
//     editMarker.setMap(null);
//   };
//   const containerDiv = document.createElement('div');
//   containerDiv.appendChild(textBox);
//   containerDiv.appendChild(document.createElement('br'));
//   containerDiv.appendChild(button);
//   return containerDiv;
// }

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
//     content: buildInfoWindowInput(lat, lng),
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

function createMap() {
  // eslint-disable-next-line no-undef
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 1.3483,
      lng: 103.681,
    },
    zoom: 4,
  });

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
        handleLocationError(true, infoWindow, map.getCenter());
      },
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // When the user clicks in the map, show a marker with a text box the user can edit
  map.addListener('click', () => {
    // Allows adding marker only if the user is logged in
    fetch('/login-status')
      .then(response => response.json())
      .then((userStatus) => {
        if (userStatus.isLoggedIn === false) {
          $('#instructUserToLoginModal').modal('show');
        } else {
          // createMarkerForEdit(event.latLng.lat(), event.latLng.lng());
        }
      });
  });
  fetchMarkers();
}

// eslint-disable-next-line no-unused-vars
function buildUI() {
  createMap();
}
