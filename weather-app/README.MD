🌦️ Weather App

A beautiful and responsive Weather App built using HTML, CSS, and JavaScript. This app fetches real-time weather data from the OpenWeather API and displays temperature, humidity, wind speed, and weather conditions dynamically.

A simple and modern Weather App built using HTML, CSS, and JavaScript.

This project uses the OpenWeather API to fetch real-time weather data such as:

🌡️ Temperature
💧 Humidity
🌬️ Wind Speed
☁️ Weather Condition
🌍 City Name
🌤️ Dynamic Weather Icons
🚀 Features

✅ Search weather by city name
✅ Real-time weather data using API
✅ Dynamic weather icons
✅ Error handling for invalid city names
✅ Responsive UI design
✅ Async/Await + Fetch API

🛠️ Technologies Used
HTML5
CSS3
JavaScript (ES6)
OpenWeather API


📂 Project Structure
weather-app/
│
├── index.html
├── style.css
├── script.js
├── images/
│   ├── clear.png
│   ├── clouds.png
│   ├── drizzle.png
│   ├── mist.png
│   ├── rain.png
│   ├── snow.png

🔑 API Setup
Step 1

Create an account on OpenWeather:

https://openweathermap.org/api

Step 2
Generate your API key.

Step 3
Replace your API key inside:

const apiKey = "YOUR_API_KEY";

⚡ How It Works
User enters city name

Button click triggers API request

Weather data fetched using Fetch API

Data displayed dynamically on webpage

Weather icon changes automatically

📸 Example API URL
https://api.openweathermap.org/data/2.5/weather?&units=metric&q=Mumbai&appid=YOUR_API_KEY

🧠 JavaScript Concepts Used
DOM Manipulation
querySelector()
addEventListener()
async / await
Fetch API
JSON
Conditions (if/else)
Dynamic image changing
innerHTML

▶️ Run Locally

Clone Project

git clone https://github.com/your-username/weather-app.git

Open Folder

cd weather-app

Run

Open index.html in browser.


🌟 Future Improvements
5-day weather forecast
Search history
Dark/Light mode
Auto detect location
Better animations
Voice search

👨‍💻 Author
Rahul Thombare

📄 License
This project is open source and free to use.