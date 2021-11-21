function weatherApi() {
    console.log("something");
    var fetchData = async () => {
    var apiWeather = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=Boston"
        );
        var data = await apiWeather.json();
        console.log(data);
}
}


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
                reject(error);pr
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
    var historyEl = document.getElementById("historyBox");
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
     
        console.log(latLongCoords);
        historyButton.onclick = function(){
            console.log(key);
            console.log(value); 
        };/*
        historyButton.addEventListener("click", function (latLongCoords) {
        //getWeather(latLongCoords);
          console.log("BooYah");
          console.log(key);
          console.log(latLongCoords);
        });*/
        historyEl.appendChild(historyButton);
        var breakLine = document.createElement("br");
        historyEl.appendChild(breakLine);

    }
        
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
        var skipOne = callWeatherApi("https://api.openweathermap.org/data/2.5/onecall?lat=42.3584&lon=-71.0598&appid=f5fcc6200f37ec0e220488ef0220dcf7");
    } else {
        var searchCoords = await cityCoords(searchCity);
    };
    weatherData = getWeather(searchCoords);
    saveWeatherData(searchCity, weatherData);
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

weatherDisplay();
