const urlParams = new URLSearchParams(window.location.search);
const parameterImageLabel = urlParams.get('imageLabel');

// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
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
