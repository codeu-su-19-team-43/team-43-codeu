const urlParams = new URLSearchParams(window.location.search);
const parameterSearchLabels = urlParams.getAll('searchLabel');

function buildSearchLabels() {
  if (parameterSearchLabels != null) {
    parameterSearchLabels.forEach((parameterSearchLabel) => {
      const searchTagContainer = document.getElementById('search-tag-container');
      const imageLabelButton = document.createElement('div');
      const uriEncodedParameterSearchLabel = encodeURIComponent(parameterSearchLabel);
      imageLabelButton.innerHTML = `<button type="button" class="btn btn-info btn-sm mr-2 mb-2 pr-1 image-label-button">
                                      <span class="mr-1">${parameterSearchLabel}</span>  
                                      <span onClick="onClickSearchLabelCancelButton('${uriEncodedParameterSearchLabel}')">
                                        <i class="fas fa-times-circle"></i>
                                      </span>
                                    </button>`;
      searchTagContainer.appendChild(imageLabelButton);
    });
  }
}

function cleanWindowLocation(windowLocation) {
  // eslint-disable-next-line no-useless-escape
  return windowLocation.replace('\?&', '?').replace(/\?$/, '');
}

function checkUniqueSearchLabel(label) {
  if (parameterSearchLabels.indexOf(label) > -1) {
    return false;
  }
  return true;
}

// eslint-disable-next-line no-unused-vars
function onClickSearchButton() {
  const searchLabel = document.getElementById('search-input').value.toLowerCase();
  if (checkUniqueSearchLabel(searchLabel)) {
    let redirectLocation = window.location.href;
    redirectLocation += redirectLocation.includes('?') ? '&' : '?';
    redirectLocation += `searchLabel=${searchLabel}`;
    window.location.replace(cleanWindowLocation(redirectLocation));
  } else {
    document.getElementById('search-input').value = '';
  }
}

// eslint-disable-next-line no-unused-vars
function onClickSearchLabelCancelButton(searchLabel) {
  const newParameterSearchLabels = parameterSearchLabels
    .filter(label => encodeURIComponent(label) !== searchLabel);
  let redirectLocation = window.location.pathname;
  newParameterSearchLabels.forEach((label, count) => {
    redirectLocation += count === 0 ? '?' : '&';
    redirectLocation += `searchLabel=${label}`;
  });
  window.location.replace(redirectLocation);
}

// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  buildSearchLabels();
  $.getScript('/js/messages-loader.js', () => {
    if (parameterSearchLabels != null && parameterSearchLabels.length > 0) {
      // eslint-disable-next-line no-undef
      fetchMessagesBySearchLabels(parameterSearchLabels);
    } else {
      // eslint-disable-next-line no-undef
      fetchAllMessages();
    }
  });
}
