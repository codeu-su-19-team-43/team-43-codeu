// Trigger resize event to redraw charts
$(window).resize(function setResizeTimeout() {
  if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
  this.resizeTimeout = setTimeout(function callResizeEndEvent() {
    $(this).trigger('resizeEnd');
  }, 500);
});

// eslint-disable-next-line no-unused-vars
function drawAllTimeTopImageLabelsChart() {
  fetch('/feed')
    .then(response => response.json())
    .then((messagesJson) => {
      // Get all image labels
      let imageLabels = [];
      // eslint-disable-next-line no-undef
      _.forEach(messagesJson, (message) => {
        if (message.imageLabels) {
          // eslint-disable-next-line no-undef
          imageLabels = _.concat(imageLabels, message.imageLabels);
        }
      });

      // Get top 10 image labels by count
      // eslint-disable-next-line no-undef
      const imageLabelsCount = _(imageLabels).groupBy()
        .map(items => ({ imageLabel: items[0], count: items.length }))
        .orderBy('count', 'desc')
        .slice(0, 10)
        .value();

      // Create chart data
      const rawAllTimeTopImageLabelsData = [['Image Label', 'Count']];
      // eslint-disable-next-line no-undef
      _.forEach(imageLabelsCount, (imageLabelCount) => {
        rawAllTimeTopImageLabelsData.push([imageLabelCount.imageLabel, imageLabelCount.count]);
      });

      // Throw error if there are no messages with images
      if (rawAllTimeTopImageLabelsData.length === 1) {
        throw new Error('Add some messages with images to see this chart!');
      }

      // Set chart data
      // eslint-disable-next-line
            const allTimeTopImageLabelsData = new google.visualization.arrayToDataTable(
        rawAllTimeTopImageLabelsData,
      );

      // Create chart options
      const allTimeTopImageLabelsChartOptions = {
        title: 'Top 10 Image Labels (All Time)',
        height: 'auto',
        width: 'auto',
      };

      // Draw chart
      // eslint-disable-next-line no-undef
      const allTimeTopImageLabelsChart = new google.visualization.BarChart(
        document.getElementById('all-time-top-image-labels-chart'),
      );
      allTimeTopImageLabelsChart.draw(allTimeTopImageLabelsData, allTimeTopImageLabelsChartOptions);

      // Redraw graph when window resize is completed
      $(window).on('resizeEnd', () => {
        allTimeTopImageLabelsChart.draw(allTimeTopImageLabelsData,
          allTimeTopImageLabelsChartOptions);
      });

      // Redirect to feed page with clicked image label as filter
      // eslint-disable-next-line no-undef
      google.visualization.events.addListener(allTimeTopImageLabelsChart, 'select', () => {
        const selected = allTimeTopImageLabelsChart.getSelection();
        if (selected) {
          const imageLabelToFilterBy = rawAllTimeTopImageLabelsData[selected[0].row + 1][0];
          window.location.href = `/feed.html?searchLabel=${encodeURI(imageLabelToFilterBy.toLowerCase())}`;
        }
      });
    })
    .catch((error) => {
      document.getElementById('all-time-top-image-labels-chart')
        .innerHTML = `<div class="alert alert-danger" role="alert">${error}</div>`;
    });
}

// eslint-disable-next-line no-unused-vars
function drawSentimentScoresChart() {
  fetch('/sentiment-scores')
    .then(response => response.json())
    .then((sentimentScoresJson) => {
      // Create chart data
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

      // Set chart data
      // eslint-disable-next-line
      const sentimentScoresData = new google.visualization.arrayToDataTable([
        ['Sentiment', 'Message Count'],
        ['Positive', positiveScoreCount],
        ['Neutral', neutralScoreCount],
        ['Negative', negativeScoreCount],
      ]);

      // Create chart options
      const sentimentScoresChartOptions = {
        title: 'Sentiment Analysis Of Messages',
        height: 'auto',
        width: 'auto',
      };

      // Create pie chart
      // eslint-disable-next-line no-undef
      const sentimentScoresChart = new google.visualization.PieChart(
        document.getElementById('sentiment-scores-chart'),
      );

      sentimentScoresChart.draw(sentimentScoresData, sentimentScoresChartOptions);

      // Redraw graph when window resize is completed
      $(window).on('resizeEnd', () => {
        sentimentScoresChart.draw(sentimentScoresData, sentimentScoresChartOptions);
      });
    });
}

// eslint-disable-next-line no-unused-vars
function drawUserMessageActivityChart() {
  fetch('/feed')
    .then(response => response.json())
    .then((messagesJson) => {
      // Get message count by date
      // eslint-disable-next-line no-undef
      const messagesGroupedByDay = _.countBy(messagesJson, message => moment(message.timestamp).format('DD/MM/YYYY'));

      // Create chart data
      const rawUserMessageActivityData = [];
      // eslint-disable-next-line no-undef
      _(messagesGroupedByDay).forOwn((value, key) => {
        rawUserMessageActivityData.push([key, value]);
      });

      if (rawUserMessageActivityData.length === 0) {
        throw new Error('Add some messages to see this chart!');
      }

      // eslint-disable-next-line no-undef
      _.reverse(rawUserMessageActivityData); // Reverse to display from first date to last date

      rawUserMessageActivityData.unshift(['Date', 'Message Count']);

      // Set chart data
      // eslint-disable-next-line
      const userMessageActivityData = new google.visualization.arrayToDataTable(
        rawUserMessageActivityData,
      );

      // Create chart options
      const userMessageActivityChartOptions = {
        title: 'User Message Activity By Day',
        height: 'auto',
        width: 'auto',
        explorer: { actions: ['dragToZoom', 'rightClickToReset'] },
        hAxes: [
          {
            title: 'Date', // x axis
          },
          {},
        ],
      };

      // Draw chart
      // eslint-disable-next-line no-undef
      const userMessageActivityChart = new google.visualization.LineChart(
        document.getElementById('user-message-activity-chart'),
      );

      userMessageActivityChart.draw(userMessageActivityData, userMessageActivityChartOptions);

      // Redraw graph when window resize is completed
      $(window).on('resizeEnd', () => {
        userMessageActivityChart.draw(userMessageActivityData, userMessageActivityChartOptions);
      });
    })
    .catch((error) => {
      document.getElementById('user-message-activity-chart')
        .innerHTML = `<div class="alert alert-danger" role="alert">${error}</div>`;
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
    title: 'Top Locations Of The Week',
    height: 'auto',
    width: 'auto',
    hAxes: [
      {
        title: 'Photo Count', // x axis
      },
      {},
    ],
  };

  // Draw bar chart
  // eslint-disable-next-line no-undef
  const locationVotesBarChart = new google.visualization.BarChart(
    document.getElementById('location-votes-chart'),
  );
  locationVotesBarChart.draw(locationVotesData, locationVotesBarChartOptions);

  $(window).on('resizeEnd', () => {
    locationVotesBarChart.draw(locationVotesData, locationVotesBarChartOptions);
  });
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
        title: 'Number Of Photos According To Categories',
        height: 'auto',
        width: 'auto',
        hAxes: [
          {
            title: 'Photo Count', // x axis
          },
          {},
        ],
      };

      // eslint-disable-next-line no-undef
      const photoCategoriesChart = new google.visualization.BarChart(
        document.getElementById('photo-categories-chart'),
      );

      photoCategoriesChart.draw(photoCategoriesData, photoCategoriesChartOptions);

      $(window).on('resizeEnd', () => {
        photoCategoriesChart.draw(photoCategoriesData, photoCategoriesChartOptions);
      });
    })
    .catch((error) => {
      document.getElementById('photo-categories-chart')
        .innerHTML = `<div class="alert alert-danger" role="alert">${error}</div>`;
    });
}
