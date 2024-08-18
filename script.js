const apiKey = 'API_KEY_HERE'; // Replace with your WeatherAPI key
const apiUrl = 'https://api.weatherapi.com/v1/current.json';

const weatherConditions = {
    clear_day: 'bg_clear_day.jpg',
    partly_cloudy: 'bg_partly_cloudy.jpg',
    cloudy: 'bg_cloudy.jpg',
    rainy: 'bg_rainy.jpg',
    stormy: 'bg_stormy.jpg',
    snowy: 'bg_snowy.jpg',
    foggy: 'bg_foggy.jpg',
    clear_night: 'bg_clear_night.jpg',
    cloudy_night: 'bg_cloudy_night.jpg'
};

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const iconElement = document.getElementById('icon');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?key=${apiKey}&q=${location}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const condition = data.current.condition.text.toLowerCase();

            // Determine the background based on condition text
            if (condition.includes('sunny') || condition.includes('clear')) {
                changeBackground('clear_day');
            } else if (condition.includes('partly cloudy')) {
                changeBackground('partly_cloudy');
            } else if (condition.includes('cloudy')) {
                changeBackground('cloudy');
            } else if (condition.includes('rain')) {
                changeBackground('rainy');
            } else if (condition.includes('thunder')) {
                changeBackground('stormy');
            } else if (condition.includes('snow')) {
                changeBackground('snowy');
            } else if (condition.includes('fog') || condition.includes('mist')) {
                changeBackground('foggy');
            } else if (condition.includes('clear') && data.current.is_day === 0) {
                changeBackground('clear_night');
            } else if (condition.includes('cloudy') && data.current.is_day === 0) {
                changeBackground('cloudy_night');
            } else {
                changeBackground('clear_day'); // Default case
            }

            // Update weather info
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function changeBackground(condition) {
    const backgroundElement = document.body;
    const imageUrl = `images/${weatherConditions[condition] || 'bg_clear_day.jpg'}`;
    backgroundElement.style.backgroundImage = `url(${imageUrl})`;
}

function updateWeatherInfo(data) {
    locationElement.textContent = `${data.location.name}, ${data.location.country}`;
    temperatureElement.textContent = `${data.current.temp_c}°C`;
    descriptionElement.textContent = capitalizeFirstLetter(data.current.condition.text);
    humidityElement.textContent = `Humidity: ${data.current.humidity}%`;
    windElement.textContent = `Wind: ${data.current.wind_kph} kph`;
    iconElement.src = `https:${data.current.condition.icon}`;
    iconElement.alt = data.current.condition.text;

    // Handle broken image
    iconElement.onerror = function() {
        this.src = 'images/default_icon.png'; // Replace with the actual path to a default image
        this.alt = 'Image not available';
    };
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
