const apiKey = '8c514e2198558806bc5e9aa22585d91e';
const weatherContainer = document.getElementById('weather-container');
const forecastContainer = document.getElementById('forecast-container');
const loadingContainer = document.getElementById('loading-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const mascotImage = document.getElementById('mascot-image');
const messageBubble = document.getElementById('message-bubble');
const messageText = document.getElementById('message-text');

// Function to fetch current weather data
async function getCurrentWeatherData(city) {
  try {
    showLoading();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    if (response.ok) {
      updateCurrentWeatherDisplay(data);
      backgroundChange(data.weather[0].main, data.sys.sunrise, data.sys.sunset, data.dt);
    } else {
      showError(`Error fetching weather data: ${data.message}`);
    }
  } catch (error) {
    showError('An error occurred while fetching weather data.');
  } finally {
    hideLoading();
  }
}

// Function to fetch 7-day forecast data
async function get7DayForecastData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    // Extract the relevant data for the 7-day forecast
    const forecast = data.list.filter((item, index) => index % 8 === 0);

    // Update the HTML with the 7-day forecast
    updateForecastDisplay(forecast);
  } catch (error) {
    console.error('Error fetching 7-day forecast:', error);
  }
}

// Function to update the current weather display
function updateCurrentWeatherDisplay(data) {
  const cityName = document.getElementById('city-name');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherCondition = document.getElementById('weather-condition');

  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherCondition.textContent = getWeatherText(data.weather[0].id);

  // Update the weather icon
  weatherIcon.innerHTML = getWeatherIcon(data.weather[0].icon);
  backgroundChange(data.weather[0].main, data.sys.sunrise, data.sys.sunset, data.dt);
}

// Function to update the 7-day forecast display
function updateForecastDisplay(forecast) {
  forecastContainer.innerHTML = '';

  forecast.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('forecast-day');

    // Create elements to display the date, weather icon, temperature, and description
    const dateElement = document.createElement('h3');
    dateElement.textContent = new Date(day.dt * 1000).toLocaleDateString();

    const iconElement = document.createElement('img');
    iconElement.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
    iconElement.alt = day.weather[0].description;

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `${day.main.temp}°C`;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = day.weather[0].description;

    // Append the elements to the dayElement
    dayElement.appendChild(dateElement);
    dayElement.appendChild(iconElement);
    dayElement.appendChild(temperatureElement);
    dayElement.appendChild(descriptionElement);

    // Append the dayElement to the forecastContainer
    forecastContainer.appendChild(dayElement);
  });
}

// Function to get the weather icon
function getWeatherIcon(iconCode) {
  switch (iconCode) {
    case '01d':
      return `<img src="weather-icons/01d.svg" alt="Clear sky (day)" class="weather-icon">`;
    case '01n':
      return `<img src="weather-icons/01n.svg" alt="Clear sky (night)" class="weather-icon">`;
    case '02d':
      return `<img src="weather-icons/02d.svg" alt="Few clouds (day)" class="weather-icon">`;
    case '02n':
      return `<img src="weather-icons/02n.svg" alt="Few clouds (night)" class="weather-icon">`;
    case '03d':
    case '03n':
      return `<img src="weather-icons/03.svg" alt="Scattered clouds" class="weather-icon">`;
    case '04d':
      return `<img src="weather-icons/04d.svg" alt="Broken clouds" class="weather-icon">`;
    case '04n':
      return `<img src="weather-icons/04n.svg" alt="Broken clouds" class="weather-icon">`;
    case '09d':
      return `<img src="weather-icons/09d.svg" alt="Shower rain" class="weather-icon">`;
    case '09n':
      return `<img src="weather-icons/09n.svg" alt="Shower rain" class="weather-icon">`;
    case '10d':
      return `<img src="weather-icons/10d.svg" alt="Rain (day)" class="weather-icon">`;
    case '10n':
      return `<img src="weather-icons/10n.svg" alt="Rain (night)" class="weather-icon">`;
    case '11d':
      return `<img src="weather-icons/11d.svg" alt="Thunderstorm" class="weather-icon">`;
    case '11n':
      return `<img src="weather-icons/11n.svg" alt="Thunderstorm" class="weather-icon">`;
    case '13d':
      return `<img src="weather-icons/13d.svg" alt="Snow" class="weather-icon">`;
    case '13n':
      return `<img src="weather-icons/13n.svg" alt="Snow" class="weather-icon">`;
    case '50d':
    case '50n':
      return `<img src="weather-icons/50.svg" alt="Mist" class="weather-icon">`;
    default:
      return `<img src="weather-icons/unknown.svg" alt="Unknown weather" class="weather-icon">`;
  }
}

// Function to get the weather condition text
function getWeatherText(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return 'Thunderstorm';
    case weatherId >= 300 && weatherId < 400:
      return 'Drizzle';
    case weatherId >= 500 && weatherId < 600:
      return 'Rain';
    case weatherId >= 600 && weatherId < 700:
      return 'Snow';
    case weatherId === 800:
      return 'Clear';
    case weatherId > 800 && weatherId < 900:
      return 'Clouds';
    default:
      return 'Unknown';
  }
}

// Function to change the background image
function backgroundChange(weather, sunrise, sunset, currentTime) {
  const currentDate = new Date(currentTime * 1000);
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);

  // Add 30 minutes to sunrise and subtract 30 minutes from sunset for twilight
  const twilightMorning = new Date(sunriseDate.getTime() - 30 * 60000);
  const twilightEvening = new Date(sunsetDate.getTime() + 30 * 60000);
  const message = getMascotMessage(weather, currentTime, sunrise, sunset);
  messageText.textContent = message;

  if (weather === 'Clear' || weather === 'Clouds') {
    if (currentDate > twilightMorning && currentDate < sunriseDate) {
      document.body.style.backgroundImage = "url('sunrise.jpg')";
    } else if (currentDate >= sunriseDate && currentDate < sunsetDate) {
      document.body.style.backgroundImage = "url('sunny.jpg')";
    } else if (currentDate >= sunsetDate && currentDate < twilightEvening) {
      document.body.style.backgroundImage = "url('sunset.jpg')";
    } else {
      document.body.style.backgroundImage = "url('night.jpg')";
    }
  } else if (weather === 'Rain' || weather === 'Drizzle') {
    document.body.style.backgroundImage = "url('rain.jpg')";
  } else if (weather === 'Snow') {
    document.body.style.backgroundImage = "url('snowy.jpg')";
  } else if (weather === 'Thunderstorm') {
    document.body.style.backgroundImage = "url('thunderstorm.jpg')";
  } else {
    // Set a default background image or color
    document.body.style.backgroundImage = "url('background image.jpg')";
  }

  // Set common background properties
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}
function getMascotMessage(weather, currentTime, sunrise, sunset) {
  const currentDate = new Date(currentTime * 1000);
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);

  if (currentDate >= sunriseDate && currentDate < sunsetDate) {
    if (weather === 'Clear') {
      return "Stay hydrated!";
    } else if (weather === 'Rain' || weather === 'Drizzle') {
      return "Hurry! Grab an umbrella!";
    } else if (weather === 'Snow') {
      return "It's cold!!";
    }
  } 
  else if (currentDate >= sunsetDate || currentDate < sunriseDate) {
    return "Zzzzz";}
    if (currentDate >= sunsetDate && currentDate < new Date(sunsetDate.getTime() + 30 * 60000)) {
      return "The sunset is beautiful!!";
    }
  
    return "How's the weather?";
  }
    
  function toggleMessageBubble() {
    if (messageBubble.classList.contains('hidden')) {
      messageBubble.classList.remove('hidden');
      setTimeout(() => {
        messageBubble.classList.add('visible');
      }, 10);
    } else {
      messageBubble.classList.remove('visible');
      setTimeout(() => {
        messageBubble.classList.add('hidden');
      }, 300);
    }
  }
// Function to show the loading state
function showLoading() {
  loadingContainer.style.display = 'block';
}

// Function to hide the loading state
function hideLoading() {
  loadingContainer.style.display = 'none';
}
mascotImage.addEventListener('click', toggleMessageBubble);

// Function to show the error message
function showError(message) {
  errorMessage.textContent = message;
  errorContainer.style.display = 'block';
}

// Function to hide the error message
function hideError() {
  errorContainer.style.display = 'none';
}

// Event listener for the search button
const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', () => {
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();

  if (city) {
    getCurrentWeatherData(city);
    get7DayForecastData(city);
    cityInput.value = '';
    hideError();
  }
});