// Get ?user=XYZ parameter value
const urlParams = new URLSearchParams(window.location.search);
const parameterUsername = urlParams.get('user');

// URL must include ?user=XYZ parameter. If not, redirect to homepage.
if (!parameterUsername) {
  window.location.replace('/');
}

/** Sets the page title based on the URL parameter username. */
function setPageTitle() {
  document.getElementById('username').innerText = parameterUsername;
  document.title = `${parameterUsername} - User Page`;
}

// eslint-disable-next-line no-unused-vars
function fetchBlobstoreUrlAndShowMessageForm() {
  fetch('/blobstore-upload-url?form=messages')
    .then(response => response.text())
    .then((imageUploadUrl) => {
      const messageForm = document.getElementById('message-form');
      messageForm.action = imageUploadUrl;
      messageForm.classList.remove('hidden');
    });
}

/**
 * Shows the message form if the user is logged in and viewing their own page.
 */
function showMessageFormIfViewingSelf() {
  fetch('/login-status')
    .then(response => response.json())
    .then((loginStatus) => {
      if (loginStatus.isLoggedIn && loginStatus.username === parameterUsername) {
        fetchBlobstoreUrlAndShowMessageForm();
        document.getElementById('edit-about-me-button').classList.remove('hidden');
      }
    });
}

function fetchAboutMe() {
  const url = `/about?user=${parameterUsername}`;
  fetch(url).then(response => response.text()).then((aboutMe) => {
    const aboutMeContainer = document.getElementById('about-me-container');
    if (aboutMe === '') {
      aboutMeContainer.innerHTML = 'This user has not entered any information yet.';
    } else {
      aboutMeContainer.innerHTML = aboutMe;
    }
  });
}

function inputTextEditor() {
  const config = {
    removePlugins: ['ImageUpload', 'Heading'], toolbar: ['bold', '|', 'italic', '|', 'bulletedList', '|', 'numberedList', '|', 'blockQuote', '|', 'Link', '|', 'undo', '|', 'redo', '|'],
  };
  // eslint-disable-next-line no-undef
  ClassicEditor.create(document.getElementById('message-input'), config);
}
/** Fetches data and populates the UI of the page. */
// eslint-disable-next-line no-unused-vars
function buildUI() {
  setPageTitle();
  showMessageFormIfViewingSelf();
  $.getScript('/js/message-loader.js', () => {
    // eslint-disable-next-line no-undef
    fetchCurrentUserMessages(parameterUsername);
  });
  fetchAboutMe();
  inputTextEditor();
}
