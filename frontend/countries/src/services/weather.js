import axios from "axios";
const api_key = import.meta.env.VITE_SOME_KEY
// variable api_key now has the value set in startup
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?&appid=${api_key}&units=metric`;

const getWeatherForLocation = (lat, lon) => {
    const url = `${baseUrl}&lat=${lat}&lon=${lon}` ;
    console.log(url)
    const request = axios.get(url);
    return request.then((response) => {
        return response.data
    });
};

const getLocationIcon = (weather) => {
    const iconId = weather.weather[0].icon;
    return `http://openweathermap.org/img/wn/${iconId}@2x.png`;
};

export default { getWeatherForLocation, getLocationIcon };