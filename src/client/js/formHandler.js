import { isValidURL } from "..";

const myAPI = 'http://localhost:8000'

function handleSubmit(event) {
    // event.preventDefault()

    // get the inputs
    let destination = document.getElementById('destination').value;
    let checkInDate = document.getElementById('checkIn').value;
    let checkOutDate = document.getElementById('checkOut').value;
    
    // declaring variables
    let destinationName = '';
    let weatherForecast = '';
    let countryCode = '';
    let destinationPicture = ''

    // check if destination is valid or not
    if (destination) {
        // get data from geonames API
        postData(`${myAPI}/destination`, { destination })
            .then(destinationData => {
                // console.log(destinationData)
                // check if date is valid or not
                const duration = dateDifference(checkInDate, checkOutDate)
                if (isNaN(duration)) {
                    return;
                }
                destinationName = `${destinationData.name}, ${destinationData.countryName}`
                countryCode = destinationData.countryCode;
                // console.log(destinationName, countryCode);

                const destinationForecast = {
                    lat: destinationData.lat,
                    lng: destinationData.lng,
                    days: duration
                }
                // get data from WeatherBIT API
                return postData(`${myAPI}/destination-forecast`, destinationForecast)
                // console.log(destinationForecast)
            }).then(weatherResult => {
                // console.log(weatherResult.description);
                weatherForecast = weatherResult.description
                // get destination picture from Pixabay API
                return postData(`${myAPI}/destination-picture`, { destination })
            }).then(destinationPic => {
                destinationPicture = destinationPic.hits[2].webformatURL;
                // console.log(destinationPicture.hits[2].webformatURL);
            }).then(() => {
                // update the UI with the result
                updateUI()
            })

            .catch(error => {
                alert(error);
            })
    }
    else {
        alert("destination is not valid")
        document.getElementById('destination').value = '';
        return
    }

    // send the url and data to the local API, then get the result back
    async function postData(url, data) {
        const req = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        try {
            const res = await req.json();
            // console.log(res)
            return res;
        }
        catch (error) {
            console.log(error);
        }
    }

    // Calculate date difference 
    function dateDifference(start, end) {
        const today = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (today.getTime() <= startDate.getTime() && today.getTime() <= endDate.getTime() && endDate.getTime() > startDate.getTime()) {
            const calcDateDifference = endDate.getTime() - startDate.getTime();
            const dateDifferenceInDays = Math.round(calcDateDifference / (1000 * 3600 * 24))
            if (dateDifferenceInDays >= 1) {
                console.log(dateDifferenceInDays)
                return dateDifferenceInDays;
            }
        }
        else {
            alert('Invalid Date')
        }
    }

    // Update the UI with the result
    function updateUI() {
        document.getElementById('tripInfo').innerHTML = `
        <form id="tripInfoForm">
            <h2 id="destinationTitle">${destinationName}</h2>
            <img src="${destinationPicture}" alt="${destinationName}">
            <hr/>
            <div class="row">
                <div class="col">
                    <label>Check In</label>
                    <p>${checkInDate}</p>
                </div>
                <div class="col">
                    <label>Check Out</label>
                    <p>${checkOutDate}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label>Duration</label>
                    <p>${dateDifference(checkInDate, checkOutDate)} days</p>
                </div>
                <div class="col">
                    <label>Weather Forecast</label>
                    <p>${weatherForecast}</p>
                </div>
            </div>
        </form>`
    }
}

export { handleSubmit }
