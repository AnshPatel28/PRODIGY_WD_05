let debounceTimer;

function debouncedFetchWeather() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchWeather, 500);
}

async function fetchWeather() {
    const locationInput = document.getElementById('locationInput').value || 'delhi';
    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${locationInput}&format=json&u=f`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '18261ef8bfmsha86c66bb0832f03p1788dbjsn8a1fe2496636',
            'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
        }
    };

    try {
        document.getElementById('loading').classList.remove('d-none');
        document.getElementById('current-weather').classList.add('d-none');
        document.getElementById('forecast-container').classList.add('d-none');

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);

        // Function to convert Fahrenheit to Celsius
        function fahrenheitToCelsius(f) {
            return ((f - 32) * 5 / 9).toFixed(1);
        }

        // Update the webpage with the fetched data
        document.getElementById('city').textContent = result.location.city;
        const tempFahrenheit = result.current_observation.condition.temperature;
        const tempCelsius = fahrenheitToCelsius(tempFahrenheit);
        document.getElementById('temperature').textContent = tempCelsius;
        document.getElementById('condition').textContent = result.current_observation.condition.text;
        document.getElementById('humidity').textContent = result.current_observation.atmosphere.humidity;
        document.getElementById('wind').textContent = `${result.current_observation.wind.speed} mph ${result.current_observation.wind.direction}`;
        document.getElementById('sunrise').textContent = result.current_observation.astronomy.sunrise;
        document.getElementById('sunset').textContent = result.current_observation.astronomy.sunset;

        // Change background image based on current condition
        updateBackground(result.current_observation.condition.text, new Date().getHours());

        // Update the 7-day forecast
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = ''; // Clear previous forecast
        const forecasts = result.forecasts.slice(0, 7); // Get next 7 days forecast

        forecasts.forEach(forecast => {
            const forecastElement = document.createElement('div');
            forecastElement.className = 'forecast-day';
            forecastElement.innerHTML = `
                <h3>${forecast.day}</h3>
                <p>${forecast.text}</p>
                <p>High: ${fahrenheitToCelsius(forecast.high)}°C</p>
                <p>Low: ${fahrenheitToCelsius(forecast.low)}°C</p>
            `;
            forecastContainer.appendChild(forecastElement);
        });

        document.getElementById('loading').classList.add('d-none');
        document.getElementById('current-weather').classList.remove('d-none');
        document.getElementById('forecast-container').classList.remove('d-none');

    } catch (error) {
        document.getElementById('loading').classList.add('d-none');
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
    }
}

function updateBackground(condition, hour) {
    const isDayTime = hour >= 6 && hour < 18;
    let backgroundImage = 'images/default_background.jpg';

    if (condition.includes('Clear')) {
        backgroundImage = isDayTime ? 'images/clear/clear_day.jpg' : 'images/clear/clear_night.jpg';
    } else if (condition.includes('Partly Cloudy')) {
        backgroundImage = isDayTime ? 'images/partly_cloudy/partly_cloudy_day.jpg' : 'images/partly_cloudy/partly_cloudy_night.jpg';
    } else if (condition.includes('Cloudy')) {
        backgroundImage = isDayTime ? 'images/cloudy/cloudy_day.jpg' : 'images/cloudy/cloudy_night.jpg';
    } else if (condition.includes('Rain')) {
        backgroundImage = isDayTime ? 'images/rain/rain_day.jpg' : 'images/rain/rain_night.jpg';
    } else if (condition.includes('Thunderstorm')) {
        backgroundImage = isDayTime ? 'images/thunderstorm/thunderstorm_day.jpg' : 'images/thunderstorm/thunderstorm_night.jpg';
    } else if (condition.includes('Snow')) {
        backgroundImage = isDayTime ? 'images/snow/snow_day.jpg' : 'images/snow/snow_night.jpg';
    } else if (condition.includes('Fog')) {
        backgroundImage = isDayTime ? 'images/fog/fog_day.jpg' : 'images/fog/fog_night.jpg';
    } else if (condition.includes('Wind')) {
        backgroundImage = isDayTime ? 'images/wind/windy_day.jpg' : 'images/wind/windy_night.jpg';
    }

    document.body.style.backgroundImage = `url(${backgroundImage})`;
}

// Call the function to fetch weather data initially for default location
fetchWeather();
