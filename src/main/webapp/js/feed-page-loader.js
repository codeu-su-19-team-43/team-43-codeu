const urlParams = new URLSearchParams(window.location.search);
const parameterImageLabel = urlParams.get('imageLabel');

function fetchImageLabels() {
  if (parameterImageLabel != null && parameterImageLabel !== '') {
    const imageLabelContainer = document.getElementById('image-label-container');
    const imageLabelButton = document.createElement('div');
    imageLabelButton.innerHTML = `<button type="button" class="btn btn-info btn-sm">
                                  <span>${parameterImageLabel} &times;</span>
                                </button>`;
    imageLabelContainer.appendChild(imageLabelButton);
  }
}

// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  fetchImageLabels();
  $.getScript('/js/message-loader.js', () => {
    if (parameterImageLabel != null) {
      // eslint-disable-next-line no-undef
      fetchMessagesByImageLabel(parameterImageLabel);
    } else {
      // eslint-disable-next-line no-undef
      fetchAllUserMessages();
    }
  });
}
