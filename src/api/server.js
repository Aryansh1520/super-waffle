const express = require('express');
const axios = require('axios');
const cors = require('cors');
const pythonBridge = require('python-bridge');
let python = pythonBridge({ python: '/usr/bin/python3' });
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());



app.use('/maps', async function(req, res) {
   
  const url = `https://maps.googleapis.com/maps${req.url}`;
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ann error occurred while trying to fetch data from Google Maps API');
  }




});
app.post('/predict', async (req, res) => {
  console.log(req.body)
  const userData = req.body;
  const serverDir = __dirname;
  python.ex`import os`;
  python.ex`os.chdir(${serverDir})`;
  python.ex`import pandas as pd`;
  python.ex`import joblib`;
  python.ex`import math`;
  python.ex`model_filename = 'linear_regression_model.pkl'`;
  const model = await python.ex`model = joblib.load(model_filename)`;
  if (userData) {
    await python.ex`current_user_data_df = pd.DataFrame([${userData}])`;
    const predictedPricePython = await python.ex`predicted_price = model.predict(current_user_data_df)`;
    const predictedPrice = await python`math.ceil(predicted_price[0])`;
    res.json({ predictedPrice });
  } else {
    console.log('userData is not ready');
  }

});



app.listen(process.env.PORT || 5000);