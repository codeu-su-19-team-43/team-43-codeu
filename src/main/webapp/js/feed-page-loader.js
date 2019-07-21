const urlParams = new URLSearchParams(window.location.search);
const parameterSearchLabels = urlParams.getAll('searchLabel');

function fetchSearchLabels() {
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

// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  fetchSearchLabels();
  $.getScript('/js/message-loader.js', () => {
    if (parameterSearchLabels != null && parameterSearchLabels.length > 0) {
      // eslint-disable-next-line no-undef
      fetchMessagesBySearchLabels(parameterSearchLabels);
    } else {
      // eslint-disable-next-line no-undef
      fetchAllMessages();
    }
  });
}
