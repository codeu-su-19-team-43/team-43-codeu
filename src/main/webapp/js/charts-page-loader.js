// eslint-disable-next-line no-unused-vars
function drawSentimentScoresChart() {
  fetch('/sentiment-scores')
    .then(response => response.json())
    .then((sentimentScoresJson) => {
      let positiveScoreCount = 0;
      let neutralScoreCount = 0;
      let negativeScoreCount = 0;
      for (let i = 0; i < sentimentScoresJson.length; i += 1) {
        if (sentimentScoresJson[i] > 0.5) {
          positiveScoreCount += 1;
        } else if (sentimentScoresJson[i] < -0.5) {
          negativeScoreCount += 1;
        } else {
          neutralScoreCount += 1;
        }
      }

      // eslint-disable-next-line
      const sentimentScoresData = new google.visualization.arrayToDataTable([
        ['Sentiment', 'Message Count'],
        ['Positive', positiveScoreCount],
        ['Neutral', neutralScoreCount],
        ['Negative', negativeScoreCount],
      ]);

      // Create chart options
      const sentimentScoresChartOptions = {
        title: 'Sentiment Analysis of Messages',
        width: 'auto',
      };

      // Create pie chart
      // eslint-disable-next-line no-undef
      const sentimentScoresChart = new google.visualization.PieChart(
        document.getElementById('sentiment-scores-chart'),
      );

      sentimentScoresChart.draw(sentimentScoresData, sentimentScoresChartOptions);
    });
}

// eslint-disable-next-line no-unused-vars
function drawLocationVotesChart() {
  // eslint-disable-next-line no-undef
  const locationVotesData = new google.visualization.DataTable();

  // Define columns for the DataTable instance
  locationVotesData.addColumn('string', 'Location');
  locationVotesData.addColumn('number', 'Votes');

  // Add data to locationVotesData
  locationVotesData.addRows([
    ['Chinatown', 6],
    ['Botanic Gardens', 10],
    ['Marina Barrage', 7],
    ['Tiong Bahru', 4],
    ['Little India', 8],
  ]);

  // Create chart options
  const locationVotesBarChartOptions = {
    title: 'Top Locations of the Week',
    width: 'auto',
  };

  // Create bar chart
  // eslint-disable-next-line no-undef
  const locationVotesBarChart = new google.visualization.BarChart(
    document.getElementById('location-votes-chart'),
  );

  locationVotesBarChart.draw(locationVotesData, locationVotesBarChartOptions);
}

// eslint-disable-next-line no-unused-vars
function drawPhotoCategoriesChart() {
  fetch('/photo-categories-chart')
    .then(response => response.json())
    .then((photoCategoriesJson) => {
      // eslint-disable-next-line no-undef
      const photoCategoriesData = new google.visualization.DataTable();
      photoCategoriesData.addColumn('string', 'Category Name');
      photoCategoriesData.addColumn('number', 'Photo Count');

      for (let i = 0; i < photoCategoriesJson.length; i += 1) {
        const photoCategoriesRow = [];
        const { categoryName } = photoCategoriesJson[i];
        const { photoCount } = photoCategoriesJson[i];
        photoCategoriesRow.push(categoryName, photoCount);

        photoCategoriesData.addRow(photoCategoriesRow);
      }

      const photoCategoriesChartOptions = {
        title: 'Number of Photos According to Categories',
        height: 'auto',
        width: 'auto',
      };

      // eslint-disable-next-line no-undef
      const photoCategoriesChart = new google.visualization.BarChart(document.getElementById('photo-categories-chart'));
      photoCategoriesChart.draw(photoCategoriesData, photoCategoriesChartOptions);
    });
}
