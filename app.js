const apiKey = 'JG1RJQWN61D8H44C'; // Replace with your Alpha Vantage API key

let loggedInUser = null;
let watchlist = [];
let stockChart = null; // Declare a variable to hold the chart instance
let lastFetchedPrices = {}; // Object to cache last fetched prices
let priceAlerts = {}; // Object to store price alerts for each stock

// Predefined users and their watchlists
const users = {
  "testUser": {
    password: "1234",
    watchlist: ['AAPL', 'MSFT'], // Each user has their own watchlist
    alerts: {}
  },
  "johnDoe": {
    password: "abcd",
    watchlist: ['GOOGL', 'TSLA'],
    alerts: {}
  }
};

// Handle user login
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (users[username] && users[username].password === password) {
    loggedInUser = username;
    document.getElementById('userGreeting').innerText = loggedInUser;

    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    // Save login state and watchlist to localStorage
    localStorage.setItem('loggedInUser', loggedInUser);
    localStorage.setItem('watchlist', JSON.stringify(users[loggedInUser].watchlist));
    localStorage.setItem('alerts', JSON.stringify(users[loggedInUser].alerts));

    loadUserWatchlist();
  } else {
    alert("Incorrect username or password.");
  }
}

// Handle user logout
function logout() {
  loggedInUser = null;
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('mainApp').style.display = 'none';
  watchlist = [];
  updateWatchlist();

  // Clear localStorage when user logs out
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('watchlist');
  localStorage.removeItem('alerts');
}

// Load the user's watchlist and alerts when they log in
function loadUserWatchlist() {
  // Load watchlist and alerts from localStorage if available
  if (localStorage.getItem('watchlist')) {
    watchlist = JSON.parse(localStorage.getItem('watchlist'));
  } else {
    watchlist = users[loggedInUser].watchlist;
  }

  if (localStorage.getItem('alerts')) {
    priceAlerts = JSON.parse(localStorage.getItem('alerts'));
  } else {
    priceAlerts = users[loggedInUser].alerts;
  }

  updateWatchlist();
  updatePrices();
}

// Add stock to the user's watchlist
function addStock() {
  const ticker = document.getElementById('tickerInput').value.toUpperCase();
  if (!ticker) return;

  if (!watchlist.includes(ticker)) {
    watchlist.push(ticker);
    users[loggedInUser].watchlist = watchlist; // Save to user's watchlist
    localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save updated watchlist to localStorage
    updateWatchlist();
    fetchStockPrice(ticker);
  }
}

// Remove stock from the user's watchlist
function removeStock(ticker) {
  watchlist = watchlist.filter(stock => stock !== ticker);
  users[loggedInUser].watchlist = watchlist; // Save updated watchlist
  localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save updated watchlist to localStorage
  updateWatchlist();
}

// Update the watchlist display
function updateWatchlist() {
  const watchlistElement = document.getElementById('watchlist');
  watchlistElement.innerHTML = '';

  watchlist.forEach(ticker => {
    const li = document.createElement('li');
    li.id = `stock-${ticker}`;
    li.innerHTML = `
      <span>${ticker}: <span id="price-${ticker}">Loading...</span></span>
      <button onclick="removeStock('${ticker}')">Remove</button>
      <button onclick="showStockChart('${ticker}')">Show Chart</button> 
      <button onclick="setPriceAlert('${ticker}')">Set Alert</button>
    `;

    watchlistElement.appendChild(li);
  });
}

// Fetch stock price and check for alerts
async function fetchStockPrice(ticker) {
  if (lastFetchedPrices[ticker]) {
    document.getElementById(`price-${ticker}`).innerText = `$${lastFetchedPrices[ticker]}`;
    checkPriceAlert(ticker, lastFetchedPrices[ticker]); // Check for price alert
    return;
  }

  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      lastFetchedPrices[ticker] = price; // Cache the last fetched price
      document.getElementById(`price-${ticker}`).innerText = `$${price}`;
      checkPriceAlert(ticker, price); // Check for price alert
    } else {
      console.error("Invalid data format:", data);
    }
  } catch (error) {
    console.error("Error fetching stock price:", error);
    document.getElementById(`price-${ticker}`).innerText = 'Error';
  }
}

// Show stock chart
function showStockChart(ticker) {
  const chartContainer = document.getElementById('chartContainer');
  chartContainer.style.display = 'block';

  const ctx = document.getElementById('myChart').getContext('2d');

  // If a chart already exists, destroy it before creating a new one
  if (stockChart) {
    stockChart.destroy();
  }

  const labels = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`); // Dummy labels
  const prices = Array.from({ length: 10 }, () => Math.random() * 100); // Dummy prices

  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${ticker} Prices`,
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Close chart
function closeChart() {
  document.getElementById('chartContainer').style.display = 'none';
}

// Set price alert
function setPriceAlert(ticker) {
  const alertPrice = prompt(`Set alert price for ${ticker}:`);
  if (alertPrice) {
    priceAlerts[ticker] = parseFloat(alertPrice);
    users[loggedInUser].alerts = priceAlerts; // Save to user's alerts
    localStorage.setItem('alerts', JSON.stringify(priceAlerts)); // Save updated alerts to localStorage
    alert(`Alert set for ${ticker} at $${alertPrice}`);
  }
}

// Check for price alert
function checkPriceAlert(ticker, currentPrice) {
  if (priceAlerts[ticker] && currentPrice >= priceAlerts[ticker]) {
    alert(`Alert: ${ticker} has reached $${currentPrice}!`);
    delete priceAlerts[ticker]; // Remove the alert after notifying
    users[loggedInUser].alerts = priceAlerts; // Save updated alerts
    localStorage.setItem('alerts', JSON.stringify(priceAlerts)); // Save updated alerts to localStorage
  }
}

// Update prices at regular intervals
setInterval(() => {
  watchlist.forEach(ticker => {
    fetchStockPrice(ticker);
  });
}, 30000); // Update every 30 seconds

// Load user data on page load
window.onload = function() {
  loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    document.getElementById('userGreeting').innerText = loggedInUser;
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    loadUserWatchlist();
  }
};
