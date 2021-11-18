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

function callWeatherApi() {
    console.log("trying to use ajax")
    $(document).ready(function(){
        $.ajax({
            //url: "https://api.openweathermap.org/data/2.5/weather?q=Boston&appid=",
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=42.3584&lon=-71.0598&appid=",
            ype: "GET",
            success: function(result) {
                console.log("api success");
                console.log(result);
            },
            error: function(error){
                console.log("api error");
                console.log(error);
            }
        })
    });
}

callWeatherApi();
