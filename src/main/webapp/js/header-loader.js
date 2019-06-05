
const JQUERY_URL = 'js/jquery.js';

function createScript(source, onload) {
  const scriptElement = document.createElement('script');
  scriptElement.src = source;
  scriptElement.onload = onload;
  return scriptElement;
}

function loadScript(source) {
  return new Promise((resolve) => {
    const scriptElement = createScript(source, () => resolve());
    document.head.appendChild(scriptElement);
  });
}

// eslint-disable-next-line no-unused-vars
function loadHeader(title, loadNavigation = true) {
  loadScript(JQUERY_URL).then(() => {
    $.ajax({
      type: 'GET',
      url: 'header.html',
      success: (response) => {
        $('head').prepend(response);
      },
    });

    if (loadNavigation) {
      $.getScript('/js/navigation-loader.js');
    }
  });
}
