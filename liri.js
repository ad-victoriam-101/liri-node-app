require('dotenv').config();
const fs = require('fs');
// const env = require("dotenv").config();
const weather = require('weather-js')
const request = require('request');
const inquirer = require('inquirer');
const Spotify = require("node-spotify-api");
const keys = require('./keys.js')
// var spotify = new Spotify(keys.spotify)
// console.log(spotify);
// end of required links
// global Variables.
var numEvents = 0;
var spaces = ("====================================================");
// start of inquirer
  inquirer.prompt([
      {
          type: "input",
          name: "userName",
          message: "Welcome to Liri! First off, What is your name?"
      },
      {
          type: "checkbox",
          name: "userInput",
          message: "What can I Help you with today?",
          choices:["Spotify","Weather","Movie Requests","Incomming Bands"]
      },
      {
          type: "confirm",
          name: "correctSelection",
          message: "Are you sure?"
      }
  ]).then((user) => {
      console.log(user);
       liriName = user.userName
      if(user.correctSelection === true){
          switch(user.userInput[0]){
            case "Spotify":
            //   would run the spotify API call here.
            spotifyCall();
            break;
            case "Weather":
            // run weather api request
            weatherCall();
            break;
            case "Movie Requests":
            // OMBD api request.
            movieCall();
            break;
            case "Incomming Bands":
            // bands in town api(saave to an array)
            bandCall();
            break;
            default:
            console.log("You broke it... (remember to hit space to select a choice) else just git gud")
          }
      }

  });
// start of function making.
// weather api call
var weatherCall = function(){
    inquirer.prompt([
        {
            type: "input",
            name: "weatherLocation",
            message: ("where do you wanna know the weather at?")
        }
    ]).then((weatherInfo) => {
        weather.find({ search: weatherInfo.weatherLocation, degreeType: "F"}, function(err,result){
            if(err){
                console.log("there was an error @:" + err);
            }
            console.log(spaces);
            console.log("Ok! " + liriName + " The weather at " + result[0].location.name + " is: ");
            console.log(JSON.stringify(result[0].current, null, 2));
            console.log(spaces);
        });
    });
}
// start of Movie Call api
var movieCall = function(movieTitle){
    inquirer.prompt([
        {
            type: "input",
            name: "movieTitle",
            message: "What's the title of the movie you're looking for?"
        }
    ]).then((movieInfo) => {
        var querryURL = "http://www.omdbapi.com/?t=" + movieInfo.movieTitle + "&y=&plot=short&apikey=trilogy";
        console.log(querryURL);
        request(querryURL,function(error,response,body){
            if(!error && response.statusCode === 200){
                var test = JSON.parse(body)
                console.log(spaces);
                console.log('');
                console.log("Here is the movie Info "+ liriName + ":" +("\n Title: "+test.Title+"\n Rated: "+test.Rated+"\n Released: "+test.Released+"\n Plot: "+test.Plot+"\n"));
                console.log('');
                console.log(spaces);
            }
        });
    })
}
var bandCall = function(){
    inquirer.prompt([
        {
            type: "input:",
            name: "bandName",
            message: "What is the name of the band you want to see?"
        }
    ]).then((bandInfo) =>{
        var bandQuerry = "https://rest.bandsintown.com/artists/"+bandInfo.bandName+"?app_id=bcbbc86f9403493566ea30fa83505947"
        var bandEventsUrl = "https://rest.bandsintown.com/artists/" + bandInfo.bandName+ "/events?app_id=bcbbc86f9403493566ea30fa83505947&date=2018-01-01%2C2019-12-31"
        request(bandQuerry,function(error,response,body){
            if(!error && response.statusCode === 200){
                var bandsParse = JSON.parse(body)
                numEvents = bandsParse.upcoming_event_count
                console.log(spaces);
                console.log("");
                console.log(bandsParse.name);
                console.log('__________________');
                console.log(bandsParse.url);
                console.log(bandsParse.name+" has " + bandsParse.upcoming_event_count + " events upcoming");
            }
        });
        request(bandEventsUrl, function(error,response,body){
            if(!error && response.statusCode === 200){
                var bandsEvents = JSON.parse(body)
                for(i =0 ; i<numEvents-1; i++){
                    console.log(bandsEvents[i].venue);
                    console.log(bandsEvents[i].datetime)
                }
            }
        });
    });
}
var spotifyCall = function(){
    inquirer.prompt([
        {
            type:"input",
            name:"spotifySearch",
            message:"Enter the band you want Spotify to look for"
        }
    ]).then((spotifyInfo) => {
        // console.log(spotifyInfo);
        spotify.search({type:'track',querry:spotifyInfo.spotifySearch, limit: 10}, function(err,data){
            if(err){
                return console.log("Error occured: "+ err);
            }
            console.log(data);
        })
    });
}