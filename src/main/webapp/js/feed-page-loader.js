// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  $.getScript('/js/message-loader.js', () => {
    // eslint-disable-next-line no-undef
    fetchAllUserMessages();
  });
}
