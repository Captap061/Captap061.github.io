const COORDS = 'coords';
const API_KEY = "10f39fedb504d1474f48592718b15859";
const weather = document.querySelector(".js-weather");

// 위도(lat), 경도(lng)를 사용하여 OpenWeatherMap API를 호출하여 날씨 정보를 가져오는 함수. 날씨 정보는 섭씨 온도로 출력
function getWeather(lat,lng) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric
    `).then(function(response) {
        return response.json();
    })
    .then(function(json) {
        const temperature = json.main.temp; // 위도와 경도
        const place = json.name; // 지역명
        weather.innerText = `${temperature} @ ${place}`
    });
}

// 사용자의 현재 위치 정보를 로컬 스토리지에 저장
function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

// 브라우저의 위치 정보를 성공적으로 가져오면 호출되는 콜백 함수로, 위도와 경도를 얻어서 getWeather 함수를 호출하고 위치 정보를 저장
function handleGeoSucces(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude : longitude,
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

// 위치 정보를 가져오지 못할 때 호출되는 콜백 함수로, 에러 메시지를 출력
function handleGeoError() {
    console.log('Cant acces geo location')
}

// 위치 정보를 요청하기 위해 navigator.geolocation.getCurrentPosition 함수 호출
function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError)
}

// 로컬 스토리지에서 저장된 위치 정보를 가져와서 날씨 정보를 얻어와 화면에 출력
function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null) {
        askForCoords();
    } else {
        const parseCoords = JSON.parse(loadedCoords);
        getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}

// 스크립트를 초기화하는 함수로, 위치 정보를 로드하고 날씨 정보를 가져와 화면에 출력
function init() {
    loadCoords();
}

init();