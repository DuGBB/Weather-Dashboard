async function callWeatherApi(apiChoice) {

    return new Promise(function (resolve, reject) {
        axios.get(apiChoice).then(
            (response) => {
                var result = response.data;
                console.log('Processing Request');
                resolve(result);
                console.log(result);
            },
                (error) => {
                reject(error);
            }
        );
    });

}

function weatherDisplay() {
    var weatherDisplay = document.getElementById("searchBox");
    var cityBox = document.createElement("textArea");
    cityBox.setAttribute("id", "city");
    var citySave = document.createElement("button");
    citySave.innerHTML = "Search";
    citySave.setAttribute("id", "citySearch");
    citySave.addEventListener("click", function() {
        citySearch();
    });
    weatherDisplay.appendChild(cityBox);
    var breakLine = document.createElement("br");
    weatherDisplay.appendChild(breakLine);
    weatherDisplay.appendChild(citySave);

    history();
}

function history() {
    var oldhistoryEl = document.getElementById("historyBox");
    var historyEl = document.createElement("div");
    historyEl.setAttribute("id", "historyBox");
    var localDictionary = localStorage.getItem("cityLongLad");
    if (localDictionary === null) {
        var callDictionary = {};
    } else {
        var callDictionary = JSON.parse(localDictionary);
    };

    for (let [key, value] of Object.entries(callDictionary)) {
        let historyButton = document.createElement("button");
        historyButton.setAttribute("id", key);
        var latLongCoords = callDictionary[key];
        historyButton.innerHTML = key;
        historyButton.onclick = function(){
            currentWeather(key);
            futureWeather(key);
        };

        historyEl.appendChild(historyButton);
        var breakLine = document.createElement("br");
        historyEl.appendChild(breakLine);
    }
    oldhistoryEl.parentElement.replaceChild(historyEl, oldhistoryEl);        
}

function currentWeather(cityName) {
    let localDictionary = localStorage.getItem("cityWeather");
    if (localDictionary === null) {
        var callDictionary = {};
    } else {
        var callDictionary = JSON.parse(localDictionary);
    }   
    let cityWeather = callDictionary[cityName];
    var currentConditions = cityWeather["current"];
    var tempCurrent = currentConditions["temp"];
    temp = ((tempCurrent-273.15)*1.8)+32;
    var currentEl = document.getElementById("cityDate");
    var currentDate = currentDay();
    currentEl.innerHTML = cityName + "  " + currentDate;

    let img = document.createElement("img");
    img.src = "http://openweathermap.org/img/w/" + currentConditions["weather"][0].icon + ".png";
    currentEl.appendChild(img);

    var currentTemp = document.getElementById("cityTemp");
    currentTemp.innerHTML = "Temp: " + temp + "\u00B0F"; 
    var currentWind = document.getElementById("cityWind");
    var windSpeed = currentConditions["wind_speed"];
    currentWind.innerHTML = "Wind: " + windSpeed + "MPH";
    var currentHumidity = document.getElementById("cityHumidity");
    var humidity = currentConditions["humidity"];
    currentHumidity.innerHTML = "Humidity: " + humidity + "%";
    var currentUv = document.getElementById("cityUv");
    var uvIndex = currentConditions["uvi"];
    currentUv.innerHTML = "UV Index: " + uvIndex;

}

function currentDay() {//date display
    var today = moment();
    var momentDisplay = moment(today).format("(M/D/YYYY)");
    return momentDisplay;
}


function localCheck(searchCity) {
    var localDictionary = localStorage.getItem("cityLongLad");
    if (localDictionary === null) {
        var callDictionary = {};
    } else {
        var callDictionary = JSON.parse(localDictionary);
    }
    console.log(callDictionary[searchCity]);
    return callDictionary[searchCity];
}

async function citySearch() {
    var searchCity = document.getElementById("city").value;
    console.log(searchCity);
    var coords = localCheck(searchCity);
    if (coords) {
        //var skipOne = callWeatherApi("https://api.openweathermap.org/data/2.5/onecall?lat=42.3584&lon=-71.0598&appid=f5fcc6200f37ec0e220488ef0220dcf7");
        var searchCoords = coords;
    } else {
        var searchCoords = await cityCoords(searchCity);
    };
    weatherData = await getWeather(searchCoords);
    saveWeatherData(searchCity, weatherData);
    history();
    currentWeather(searchCity);
    futureWeather(searchCity);
}

function saveWeatherData(city, data){
    // get info in local storage so I don't overwrite exisitng info
    var localDictionary = localStorage.getItem("cityWeather");
    if (localDictionary === null) {
        var callDictionary = {};
    } else {
        var callDictionary = JSON.parse(localDictionary);
    }

    callDictionary[city] = data;
    localStorage["cityWeather"] = JSON.stringify(callDictionary);
}

async function getWeather(coordSearch) {
    var weatherData = await callWeatherApi("https://api.openweathermap.org/data/2.5/onecall?lat=" + coordSearch["lat"] + "&lon=" + coordSearch["lon"] + "&exclude=minutely,hourly,alerts&appid=f5fcc6200f37ec0e220488ef0220dcf7");
    console.log(weatherData);
    // return weather JSON to function asking for data
    return weatherData;
}

async function cityCoords(cityName) {
    var cityLatLong = await callWeatherApi("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=f5fcc6200f37ec0e220488ef0220dcf7");
    var localDictionary = localStorage.getItem("cityLongLad");
    if (localDictionary === null) {
        var callDictionary = {};
    } else {
        var callDictionary = JSON.parse(localDictionary);
    }
    var CoordValue = cityLatLong["coord"];
    callDictionary[cityName] = CoordValue;
    localStorage["cityLongLad"] = JSON.stringify(callDictionary);
    return CoordValue;

}

function futureWeather(cityName) {
    let localDictionary = localStorage.getItem("cityWeather");
    if (localDictionary === null) {
        var callDictionary = {};
    } else {
        var callDictionary = JSON.parse(localDictionary);
    }   
    let cityWeather = callDictionary[cityName];
    var futureConditions = cityWeather["daily"];
    var oldConditionsEl = document.getElementById("futureConditions");
    var futureConditionsEl = document.createElement("div");
    futureConditionsEl.setAttribute("id", "futureConditions");
    for (let index = 0; index < 5; index++) {
        const element = futureConditions[index];
        var futureEl = document.createElement("p");
        var futureDate = futureDay(index + 1);
        futureEl.innerHTML = futureDate;
        console.log(futureDate);
        const dailyEl = document.createElement("div");
        dailyEl.appendChild(futureEl);
        futureConditionsEl.appendChild(dailyEl);
        let img = document.createElement("img");
        img.src = "http://openweathermap.org/img/w/" + element["weather"][0].icon + ".png";
        futureConditionsEl.appendChild(img);
        let tempFuture = element["temp"].day;
        temp = ((tempFuture-273.15)*1.8)+32;
        let futureTemp = document.createElement("p");
        futureTemp.innerHTML = "Temp: " + temp + "\u00B0F"; 
        futureConditionsEl.appendChild(futureTemp);
        let futureWind = document.createElement("p");
        let windSpeed = element.wind_speed;
        futureWind.innerHTML = "Wind: " + windSpeed + "MPH";
        futureConditionsEl.appendChild(futureWind);
        let futureHumidity = document.createElement("p");
        let humidity = element.humidity;
        futureHumidity.innerHTML = "Humidity: " + humidity + "%";
        futureConditionsEl.appendChild(futureHumidity);
    }

    oldConditionsEl.parentElement.replaceChild(futureConditionsEl, oldConditionsEl);

    
}

function futureDay(futureDate) {//date display
    var today = moment().add(futureDate, 'd');
    var momentDisplay = moment(today).format("M/D/YYYY");
    return momentDisplay;
}


weatherDisplay();
