
Real-time Stock Price Tracker

Overview
--------
The Real-time Stock Price Tracker is a web application that allows users to track real-time stock prices, manage a personal watchlist, and set price alerts for specific stocks. This project is built using HTML, CSS, and JavaScript, and fetches real-time stock prices from the Alpha Vantage API. The application includes user authentication and dynamic price chart visualization using Chart.js.

Features
--------
- User Authentication: Users can log in using predefined credentials. Each user has a personalized watchlist and stock price alerts.
- Watchlist Management: Add or remove stocks from a personalized watchlist.
- Real-time Stock Prices: Fetch and display the latest stock prices for selected companies.
- Price Alerts: Set and manage price alerts. Receive alerts when stock prices reach a defined threshold.
- Stock Price Charts: Visualize stock price data using dynamic charts.
- Persistent Data: The application stores user session data, watchlists, and alerts in local storage to maintain the session across page reloads.

How to Run
----------
1. Clone or download this repository.
2. Open `index.html` in your web browser.
3. Log in using one of the predefined users (see below).
4. Add stock ticker symbols (e.g., AAPL, GOOGL) to your watchlist to view real-time prices and set alerts.

Predefined Users
----------------
- testUser
  - Username: testUser
  - Password: 1234
  - Watchlist: AAPL, MSFT
  
- johnDoe
  - Username: johnDoe
  - Password: abcd
  - Watchlist: GOOGL, TSLA

Technologies Used
-----------------
- HTML/CSS: For structure and styling of the web interface.
- JavaScript: Handles dynamic interactions such as fetching stock prices, managing watchlists, and user authentication.
- Alpha Vantage API: Used to retrieve real-time stock prices.
- Chart.js: Displays stock price data in dynamic charts.
- Local Storage: Stores session data (watchlist, alerts) between page reloads.

Project Structure
-----------------
- index.html: The main HTML file that provides the layout of the application.
- styles.css: Contains the styles for the app’s UI elements.
- app.js: The main JavaScript file that handles the app’s functionality, including fetching stock data, managing user sessions, and rendering charts.

API Key
-------
To use this application, you'll need to replace the placeholder API key in app.js with your own Alpha Vantage API key. You can sign up and get a free key here: https://www.alphavantage.co/support/#api-key.

License
-------
This project is licensed under the MIT License. See the LICENSE file for more details.
