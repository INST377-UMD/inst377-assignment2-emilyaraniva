const API_KEY = "aOeoBpccikrfnHeHB7Z0xF9DVP7viX7m";

function getPastDate(daysAgo) {
  const today = new Date();
  const past = new Date(today);
  past.setDate(past.getDate() - daysAgo);
  return past.toISOString().split('T')[0];
}

async function fetchStockData(ticker, days) {
  const today = new Date().toISOString().split('T')[0];
  const fromDate = getPastDate(days);
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('API Response:', data);

    if (data.results && data.results.length > 0) {
      return data.results;
    } else {
      alert(`No data found for ticker: ${ticker}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Error fetching stock data.');
    return [];
  }
}

function convertEpochToDate(epoch) {
  const date = new Date(epoch);
  return date.toISOString().split('T')[0];
}

function renderChart(ticker, dataPoints) {
  const ctx = document.getElementById('stockChart').getContext('2d');

  if (window.currentChart) {
    window.currentChart.destroy();
  }

  const labels = dataPoints.map(point => convertEpochToDate(point.t));
  const closingPrices = dataPoints.map(point => point.c);

  window.currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${ticker} Closing Prices`,
        data: closingPrices,
        borderColor: 'blue',
        backgroundColor: 'lightblue',
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

async function handleLookup(ticker, days) {
  const data = await fetchStockData(ticker.toUpperCase(), days);
  if (data.length > 0) {
    renderChart(ticker.toUpperCase(), data);
  } else {
    alert('No data found or invalid ticker.');
  }
}

async function fetchRedditTopStocks() {
  const url = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';
  try {
    const response = await fetch(url);
    const data = await response.json();

    const top5 = data.slice(0, 5);
    const tableBody = document.querySelector('#reddit-stock-table tbody');
    tableBody.innerHTML = '';

    top5.forEach(stock => {
      const row = document.createElement('tr');

      const tickerCell = document.createElement('td');
      const link = document.createElement('a');
      link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
      link.target = '_blank';
      link.textContent = stock.ticker;
      tickerCell.appendChild(link);

      const commentsCell = document.createElement('td');
      commentsCell.textContent = stock.no_of_comments;

      const sentimentCell = document.createElement('td');
      const sentimentIcon = document.createElement('span');
      sentimentIcon.textContent = stock.sentiment === 'Bullish' ? '📈' :
                                  stock.sentiment === 'Bearish' ? '📉' : '❓';

      sentimentCell.textContent = stock.sentiment + ' ';
      sentimentCell.appendChild(sentimentIcon);

      row.appendChild(tickerCell);
      row.appendChild(commentsCell);
      row.appendChild(sentimentCell);
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Failed to fetch Reddit stocks:', error);
  }
}

function turnOnAudio() {
  if (annyang) annyang.start();
}

function turnOffAudio() {
  if (annyang) annyang.abort();
}

if (annyang) {
  const commands = {
    hello: () => alert('Hello World'),
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      const dest = page.toLowerCase();
      if (dest.includes('home')) window.location.href = 'index.html';
      else if (dest.includes('stocks')) window.location.href = 'stocks.html';
      else if (dest.includes('dogs')) window.location.href = 'dogs.html';
    },
    'lookup *ticker': (ticker) => {
      const range = document.querySelector('input[name="range"]:checked').value;
      handleLookup(ticker, parseInt(range));
    }
  };
  annyang.addCommands(commands);
}

window.onload = function () {
  document.getElementById('lookupBtn').addEventListener('click', () => {
    const ticker = document.getElementById('tickerInput').value;
    const range = document.querySelector('input[name="range"]:checked').value;
    handleLookup(ticker, parseInt(range));
  });

  fetchRedditTopStocks();
};
