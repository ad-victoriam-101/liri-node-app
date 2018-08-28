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
        console.log(bandInfo);

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