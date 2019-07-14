// Get ?user=XYZ parameter value
const urlParams = new URLSearchParams(window.location.search);
const parameterUsername = urlParams.get('user');
const profileElements = [
  {
    name: 'username',
    id: 'username-input',
    icon: 'user',
    placeholder: 'Username',
  },
  {
    name: 'location',
    id: 'location-input',
    icon: 'map-marker-alt',
    placeholder: 'Location',
  },
  {
    name: 'organization',
    id: 'organization-input',
    icon: 'users',
    placeholder: 'Organization',
  },
  {
    name: 'website',
    id: 'website-input',
    icon: 'link',
    placeholder: 'Website',
  },
];

const supportedLangCodes = [
  { text: 'Choose language for translation...', value: '' },
  { text: 'Chinese', value: 'zh' },
  { text: 'French', value: 'fr' },
  { text: 'Hindi', value: 'hi' },
  { text: 'Malay', value: 'ms' },
  { text: 'Spanish', value: 'es' },
  { text: 'Tamil', value: 'ta' },
];

function getLangTextFromLangCode(langCode) {
  let langText = 'Spanish'; // return default if not found

  for (let i = 0; i < supportedLangCodes.length; i += 1) {
    if (supportedLangCodes[i].value === langCode) {
      langText = supportedLangCodes[i].text;
      break;
    }
  }

  return langText;
}

// URL must include ?user=XYZ parameter. If not, redirect to homepage.
if (!parameterUsername) {
  window.location.replace('/');
}

/** Sets the page title based on the URL parameter username. */
function setPageTitle() {
  document.title = `${parameterUsername} - User Page`;
}

function getSelectMenuForLangCode(userProfile) {
  const selectMenuDiv = document.createElement('div');
  selectMenuDiv.classList.add('input-group', 'input-group-sm', 'mb-3');

  // icon label for select menu
  const selectMenuIconDiv = document.createElement('div');
  selectMenuIconDiv.classList.add('input-group-prepend');
  const selectMenuIconSpan = document.createElement('span');
  selectMenuIconSpan.classList.add('input-group-text', 'icon-container');
  const selectMenuIcon = document.createElement('i');
  selectMenuIcon.classList.add('fas', 'fa-language');
  selectMenuIconSpan.appendChild(selectMenuIcon);
  selectMenuIconDiv.appendChild(selectMenuIconSpan);

  selectMenuDiv.appendChild(selectMenuIconDiv);

  // initialize select menu
  const selectMenu = document.createElement('select');
  selectMenu.classList.add('custom-select');
  selectMenu.name = 'langCodeForTranslation';
  selectMenu.id = 'language-for-translation-menu';

  // get currently selected language code
  let selectedLangCode = 'Choose language for translation...';
  if (userProfile != null && userProfile.langCodeForTranslation != null && userProfile.langCodeForTranslation !== '') {
    selectedLangCode = userProfile.langCodeForTranslation;
  }

  // select menu options
  supportedLangCodes.forEach((supportedlangCode) => {
    const option = document.createElement('option');

    // auto select option with currently selected language code
    if (supportedlangCode.value === selectedLangCode) {
      option.setAttribute('selected', 'true');
    }

    option.value = supportedlangCode.value;
    option.text = supportedlangCode.text;
    selectMenu.appendChild(option);
  });

  selectMenuDiv.appendChild(selectMenu);
  return selectMenuDiv;
}

function loadProfileForm() {
  const url = `/user-profile?user=${parameterUsername}`;
  fetch(url).then(response => response.json()).then((userProfile) => {
    const profileForm = document.getElementById('profile-form-container');

    // add select menu for choosing language code
    profileForm.insertBefore(getSelectMenuForLangCode(), profileForm.childNodes[1]);

    // add rest of profile form elements
    profileElements.reverse().forEach((element) => {
      const inputGroup = document.createElement('div');
      inputGroup.innerHTML = `<div class="input-group input-group-sm mb-3">
                                <div class="input-group-prepend">
                                  <span class="input-group-text icon-container"><i class="fas fa-${element.icon}"></i></span>
                                </div>
                                <input
                                  name=${element.name}
                                  id=${element.id}
                                  class=form-control
                                  type=text
                                  value="${userProfile != null && userProfile[element.name] != null && userProfile[element.name] !== '' ? userProfile[element.name] : ''}"
                                  placeholder="${userProfile != null && userProfile[element.name] != null && userProfile[element.name] !== '' ? userProfile[element.name] : element.placeholder}"
                                  onblur="this.placeholder='${element.placeholder}'"
                                  onfocus="this.placeholder=''"
                                />
                              </div>`;
      profileForm.insertBefore(inputGroup, profileForm.childNodes[1]);
    });

    // add input group for about me section
    const inputGroup = document.createElement('div');
    inputGroup.innerHTML = `<div class="input-group input-group-sm mb-3">
                              <textarea
                                name="aboutme"
                                id="aboutme-input"
                                placeholder="${userProfile != null && userProfile.aboutMe != null && userProfile.aboutMe !== '' ? userProfile.aboutMe : 'About Me'}"
                                onfocus="this.placeholder = ''"
                                onblur="this.placeholder = 'About me'"
                                rows="3"
                                maxlength="100"
                                class=form-control
                                type=text
                              >${userProfile != null && userProfile.aboutMe != null && userProfile.aboutMe !== '' ? userProfile.aboutMe : ''}</textarea>
                            </div>`;
    profileForm.insertBefore(inputGroup, profileForm.childNodes[1]);
  });
}

function fetchBlobstoreUrlAndShowEditProfileImageLabel() {
  fetch('/blobstore-upload-url?form=profile-image')
    .then(response => response.text())
    .then((imageUploadUrl) => {
      const messageForm = document.getElementById('profile-image-form');
      messageForm.action = imageUploadUrl;
      document.getElementById('edit-profile-image').classList.remove('hidden');
      $('#profile-image-modal').on('click', (event) => {
        if (event.target === document.getElementById('profile-image-modal')) {
          document.getElementById('profile-image-modal-content').classList.add('hidden');
        }
      });
    });
}

function fetchProfileImage() {
  fetch(`/profile-image?user=${parameterUsername}`)
    .then(response => response.text())
    .then((imageUrl) => {
      if (imageUrl != null && imageUrl !== '') {
        document.getElementById('user-profile-image').src = imageUrl;
      }
    });
}

// eslint-disable-next-line no-unused-vars
function fetchBlobstoreUrlAndShowMessageForm() {
  fetch('/blobstore-upload-url?form=user-messages')
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
function showMessageFormAndEditProfileButtonIfViewingSelf() {
  fetch('/login-status')
    .then(response => response.json())
    .then((loginStatus) => {
      if (loginStatus.isLoggedIn && loginStatus.username === parameterUsername) {
        fetchBlobstoreUrlAndShowMessageForm();
        fetchBlobstoreUrlAndShowEditProfileImageLabel();
        document.getElementById('edit-profile-button').classList.remove('hidden');
      }
    });
}

function fetchUserProfile() {
  const url = `/user-profile?user=${parameterUsername}`;
  fetch(url).then(response => response.json()).then((userProfile) => {
    if (userProfile != null) {
      const profileContainer = document.getElementById('profile-detail-container');
      profileContainer.innerHTML = '';

      if ('username' in userProfile && userProfile.username != null && userProfile.username !== '') {
        document.getElementById('username').innerHTML = userProfile.username;
      } else {
        document.getElementById('username').innerHTML = parameterUsername;
      }

      if ('aboutMe' in userProfile && userProfile.aboutMe != null && userProfile.aboutMe !== '') {
        document.getElementById('aboutme').innerHTML = userProfile.aboutMe;
      } else {
        document.getElementById('aboutme').innerHTML = '';
      }

      profileElements.forEach((element) => {
        if (element.name !== 'username') {
          if (element.name in userProfile && userProfile[element.name] != null && userProfile[element.name] !== '') {
            const profileElement = document.createElement('div');
            if (element.name === 'website') {
              profileElement.innerHTML = `<div class="input-group mb-2 profile-element">
                                            <span class="icon-container pr-1 pl-1 d-flex justify-content-center"><i class="fas fa-${element.icon}"></i></span>
                                            <a href=${userProfile[element.name]}>${userProfile[element.name]}</a>
                                          </div>`;
            } else {
              profileElement.innerHTML = `<div class="input-group mb-2 profile-element">
                                            <span class="icon-container pr-1 pl-1 d-flex justify-content-center"><i class="detail-icon fas fa-${element.icon}"></i></span>
                                            <p class="profile-detail mb-0">${userProfile[element.name]}</p>
                                          </div>`;
            }
            profileContainer.appendChild(profileElement);
          }
        }
      });

      const langProfileElementName = 'langCodeForTranslation';
      if (langProfileElementName in userProfile && userProfile.langCodeForTranslation != null && userProfile.langCodeForTranslation !== '') {
        const langProfileElement = document.createElement('div');
        langProfileElement.innerHTML = `<div class="input-group mb-2 profile-element">
                                         <span class="icon-container pr-1 pl-1 d-flex justify-content-center"><i class="detail-icon fas fa-language"></i></span>
                                         <p class="profile-detail mb-0">${getLangTextFromLangCode(userProfile.langCodeForTranslation)}</p>
                                        </div>`;
        profileContainer.appendChild(langProfileElement);
      }
    } else {
      document.getElementById('username').innerHTML = parameterUsername;
    }
  });
}

function inputTextEditor() {
  const config = {
    removePlugins: ['ImageUpload', 'Heading'],
    toolbar: ['bold', '|', 'italic', '|', 'bulletedList', '|', 'numberedList', '|', 'blockQuote', '|', 'Link', '|', 'undo', '|', 'redo', '|'],
  };

  // eslint-disable-next-line no-undef
  ClassicEditor.create(document.getElementById('message-input'), config);
}

/** Fetches data and populates the UI of the page. */
// eslint-disable-next-line no-unused-vars
function buildUI() {
  setPageTitle();
  showMessageFormAndEditProfileButtonIfViewingSelf();
  $.getScript('/js/message-loader.js', () => {
    // eslint-disable-next-line no-undef
    fetchMessagesByUser(parameterUsername);
  });
  fetchProfileImage();
  fetchUserProfile();
  inputTextEditor();
  loadProfileForm();
}
