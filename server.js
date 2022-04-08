const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.unsubscribe(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello World");
});

// fetching data from given API
async function getHospitals() {
    try {
        const response = await axios.get('https://apitest2.smartsevak.com/places');
        const hospitals = response.data.data;
        return hospitals;
    } catch (error) {
        console.log(error);
    }
}

// Function to calculate distance between 2 points on the Earth
function distance(lat1, lat2, lng1, lng2) {

    lng1 =  lng1 * Math.PI / 180;
    lng2 = lng2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlng = lng2 - lng1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlng / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    return(c * r);
}

app.get('/hospital', async (req, res) => {

    const hospitals = await getHospitals();

    const lat = req.query.lat;
    const lng = req.query.lng;

    hospitals.sort((h1, h2) => {
        const dist1 = distance(h1.lat, h1.lng, lat, lng);
        const dist2 = distance(h2.lat, h2.lng, lat, lng);
        return  dist1 - dist2;
    });

    res.send(hospitals);
});

app.listen(port, () => {
    console.log(`Running at port ${port}`);
});