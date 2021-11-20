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

//weatherApi();

function callWeatherApi(apiChoice) {
    $(document).ready(function(){
        $.ajax({
          
           url: apiChoice, 
            type: "GET",
            success: function(result) {
                console.log("api success");
                console.log(result);
                return result;
            },
            error: function(error){
                console.log("api error");
                console.log(error);
            }
        })
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
    console.log("BooYahh");
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
        var cityLatLong = callWeatherApi("https://api.openweathermap.org/data/2.5/weather?q=Boston&appid=");
    };
}

weatherDisplay();
