const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const cors = require('cors')
// const mockAPIResponse = require('./mockAPI.js')

const app = express()

dotenv.config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static('dist'))

// APIs Auth
const API = {
    GEONAMES_API_URL: "http://api.geonames.org/searchJSON?q=",
    GEONAMES_API_KEY: process.env.GEONAMES_KEY,
    WEATHERBIT_API_URL: "https://api.weatherbit.io/v2.0/forecast/daily?",
    WEATHERBIT_API_KEY: process.env.WEATHERBIT_KEY,
    PIXABAY_API_URL: "https://pixabay.com/api/?",
    PIXABAY_API_KEY: process.env.PIXABAY_KEY
}

// console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile(path.resolve('src/client/views/index.html'))
    // res.sendFile('dist/index.html')
})

// Geonames API
app.post('/destination', async function(req, res) {
    // console.log(req.body);
    const {destination} = req.body
    // console.log(destination);
    // building the GEONAMES URL
    geoNamesUrl = `${API.GEONAMES_API_URL}${destination}&maxRows=1&username=${API.GEONAMES_API_KEY}`
    const result = await fetch(geoNamesUrl);
    const destinationData = await result.json();
    try {
        // console.log(destinationData.geonames[0]);
        // send the result to the client
        res.send(destinationData.geonames[0])
    }
    catch(error) {
        console.log(error);
    }
})

// WeatherBIT API
app.post('/destination-forecast', async function(req, res) {
    // console.log(req.body);
    const forecast = req.body
    // console.log(forecast);
    // building the GEONAMES URL
    weatherBITUrl = `${API.WEATHERBIT_API_URL}&lat=${forecast.lat}&lon=${forecast.lng}&days=3&key=${API.WEATHERBIT_API_KEY}`;
    const result = await fetch(weatherBITUrl);
    const weathernData = await result.json();
    const weatherStatus = weathernData.data[0].weather;
    try {
        // console.log(weatherStatus);
        // send the result to the client
        res.send(weatherStatus)
    }
    catch(error) {
        console.log(error);
    }
})

// Pixabay API
app.post('/destination-picture', async function(req, res) {
    const destination = req.body.destination;
    // console.log(destination)
    pixabayUrl = `${API.PIXABAY_API_URL}key=${API.PIXABAY_API_KEY}&q=${destination}&image_type=photo&orientation=horizontal&per_page=3&pretty=true`;
    const result = await fetch(pixabayUrl);
    const destinationPictures = await result.json();
    const destinationPic = destinationPictures.hits[2].webformatURL;
    try {
        // console.log(destinationPic);
        // send the result to the client
        res.send(destinationPictures)
    }
    catch(error) {
        console.log(error);
    }
})

// designates what port the app will listen to for incoming requests
app.get('/test', function (req, res) {
    // res.send(mockAPIResponse)
})

const port = 8000;
app.listen(port, function () {
    console.log(`Server run on port ${port}`)
    // console.log(`API_key = ${API_DATA.API_KEY}`);
})