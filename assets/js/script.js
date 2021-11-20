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
    var weatherDisplay = document.getElementById("containerBlock");
    var cityBox = document.createElement("textArea");
    cityBox.setAttribute("id", "city");
    var citySave = document.createElement("button");
    citySave.innerHTML = "Search";
    citySave.setAttribute("id", "citySearch");
    citySave.addEventListener("click", function() {
        citySearch();
    });
    weatherDisplay.appendChild(cityBox);
    weatherDisplay.appendChild(citySave);
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

function citySearch() {
    var searchCity = document.getElementById("city").value;
    console.log(searchCity);
    var coords = localCheck(searchCity);
    if (coords) {
        var skipOne = callWeatherApi("https://api.openweathermap.org/data/2.5/onecall?lat=42.3584&lon=-71.0598&appid=f5fcc6200f37ec0e220488ef0220dcf7");
    } else {
        cityCoords(searchCity);
    };
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
    

}

weatherDisplay();
