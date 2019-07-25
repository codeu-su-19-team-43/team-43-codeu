const urlParams = new URLSearchParams(window.location.search);
const messageIdParam = urlParams.getAll('messageId');

// Set message page header text.
function buildMessagePageHeader(message) {
  const messagePageHeaderEl = document.getElementById('message-page-header');
  messagePageHeaderEl.innerText = `Viewing message posted by ${message.user}`;
}

// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  const messageUrl = `/message?messageId=${messageIdParam}`;
  fetch(messageUrl)
    .then(response => response.json())
    .then((message) => {
      buildMessagePageHeader(message);
      const messageContainer = document.getElementById('message-container');
      $.getScript('/js/messages-loader.js', () => {
        // eslint-disable-next-line no-undef
        messageContainer.appendChild(buildMessageDiv(message));
      });
    });
}
