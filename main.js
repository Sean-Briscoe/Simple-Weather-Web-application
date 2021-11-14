
const express = require('express')
const fetch = require('cross-fetch')
const app = express()
const port = 3000
const path=require("path")
let publicPath= path.resolve(__dirname,"public")
app.use(express.static(publicPath))
app.get('/weather/:City/:Code', sendrandom)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
function sendrandom(req, res) {
let City = req.params.City
let Code = req.params.Code
fetch('https://api.openweathermap.org/data/2.5/weather?q='+City+','+Code+'&units=metric&APPID=3e2d927d4f28b456c6bc662f34350957')
.then(res=>{
if (res.status >= 400) {
throw new Error("Bad response from server");
 }
return res.json();
 }).then(data =>{
  var latitude = data.coord.lat;
  var longitude = data.coord.lon;
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&exclude=minutely,hourly,alerts&units=metric&appid=3e2d927d4f28b456c6bc662f34350957')
    .then(res=>{
  	if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    return res.json();
    }).then(data =>{
      var temperature = []; var maxTemperature=-100 ; var minTemperature =100;
      var wind = []
      var forecast = [] ; var rain = [];
      var rainCheck, pollution;
      var warm; var polluted;
      for(let i = 0; i < 5; i++){

      temperature[i] = data.daily[i].temp.day;
      if(minTemperature > data.daily[i].temp.min) minTemperature = data.daily[i].temp.min;
      if(maxTemperature < data.daily[i].temp.max) maxTemperature = data.daily[i].temp.max;
      wind[i] = data.daily[i].wind_speed;
      forecast[i] = data.daily[i].weather[0].main;
      rain[i] = data.daily[i].weather[0].description;
      if(maxTemperature < 10) warm = 'It will be cold pack accordingly!';
      else if(minTemperature < 10 && maxTemperature > 20) warm = 'It willbe warm pack accordingly!';
      else warm = 'It will be hot pack accordingly!';

 }
rainCheck = willItRain(forecast, rainCheck);
return fetch('http://api.openweathermap.org/data/2.5/air_pollution?lat='+latitude+'&lon='+longitude+'&appid=3e2d927d4f28b456c6bc662f34350957')
  .then( res => {
      if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    return res.json();
    }).then( data => {
      pollution = data.list[0].components.pm2_5
      if(pollution > 10) polluted = true;
      res.json({temperature: temperature, Hottest: maxTemperature, Coldest:
      minTemperature, Windspeeds: wind, Forecast: forecast,
      Rainfall: rain, Rain: rainCheck, Pollution: pollution, Heat: warm,
      Polluted: polluted})
     })
   })
 })
}
function willItRain(forecast, rainCheck){
rainCheck = false
for(let i = 0; i < 5; i++){
  if(forecast[i] == "Rain"){
    rainCheck = true
    break;
  }
 }
  return rainCheck
}
