const urlParams = new URLSearchParams(window.location.search);
const parameterImageLabels = urlParams.getAll('imageLabel');

function fetchImageLabels() {
  if (parameterImageLabels != null) {
    parameterImageLabels.forEach((parameterImageLabel) => {
      const searchTagContainer = document.getElementById('search-tag-container');
      const imageLabelButton = document.createElement('div');
      const uriEncodedParameterImageLabel = encodeURIComponent(parameterImageLabel);
      imageLabelButton.innerHTML = `<button type="button" class="btn btn-info btn-sm mr-2 mb-2 pr-1 imageLabelButton">
                                      <span class="mr-1">${parameterImageLabel}</span>  
                                      <span onClick="onClickImageLabelCancelButton('${uriEncodedParameterImageLabel}')">
                                        <i class="fas fa-times-circle"></i>
                                      </span>
                                    </button>`;
      searchTagContainer.appendChild(imageLabelButton);
    });
  }
}

// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  fetchImageLabels();
  $.getScript('/js/message-loader.js', () => {
    if (parameterImageLabels != null && parameterImageLabels.length > 0) {
      // eslint-disable-next-line no-undef
      fetchMessagesByImageLabels(parameterImageLabels);
    } else {
      // eslint-disable-next-line no-undef
      fetchAllMessages();
    }
  });
}
