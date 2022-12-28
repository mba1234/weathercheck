const express = require("express");
const http = require("http");
const fs   = require("fs");
var requests = require("requests");
const app = express();
const bodyparser = require("body-parser");
const homeFile = fs.readFileSync("piu.html","utf-8");
app.use(bodyparser.urlencoded({extended:true}));
const replaceVal = (tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgval.main. temp_max);
    temperature = temperature.replace("{%location%}",orgval.name);
    temperature = temperature.replace("{%country%}",orgval.sys.country);
    temperature = temperature.replace("{%p%}",orgval.weather[0].icon);
    temperature = temperature.replace("{%dil%}",orgval.weather[0].description);
    temperature = temperature.replace("{%dili%}",orgval.main.pressure);
    temperature = temperature.replace("{%dilis%}",orgval.main.humidity);
    return temperature;
};



//const server = http.createServer(function(req,res){
    app.get("/",function(req,res){
        res.sendFile(__dirname +"/form.html");
    });
  // if(req.url ="/"){
    app.post("/",function(req,res){
        const query = req.body.cityname;
const apikey = "ec7715eb2cb832376ddfe631142c09d2";
const unit =  "metric";
   
        requests(
        "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+unit
         )
        .on("data",  (chunk)=> {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            const realtimedata = arrdata.map((val)=> replaceVal(homeFile,val)).join("");
               
            
            
          //console.log(arrdata[0].weather[0].icon);
          res.write(realtimedata);
          console.log(realtimedata);
        })
        .on("end", function (err) {
          if (err) return console.log("connection closed due to errors", err);
         
          console.log("end"); 
          res.end();
     });
    })  //}

//server.listen(8000,"127.0.0.1");

app.listen(process.env.port || 8000);