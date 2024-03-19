const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/maps', async function(req, res) {
   
  const url = `https://maps.googleapis.com/maps${req.url}`;
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while trying to fetch data from Google Maps API');
  }
});

app.listen(process.env.PORT || 5000);