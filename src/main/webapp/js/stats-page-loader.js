
function buildStatElement(statString) {
  const statElement = document.createElement('p');
  statElement.appendChild(document.createTextNode(statString));
  return statElement;
}

// Fetch stats and display them in the page.
function fetchStats() {
  const url = '/stats';
  fetch(url).then(response => response.json()).then((stats) => {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';

    const messageCountElement = buildStatElement(`Message count: ${stats.messageCount}`);
    statsContainer.appendChild(messageCountElement);
  });
}

// Fetch data and populate the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  fetchStats();
}
