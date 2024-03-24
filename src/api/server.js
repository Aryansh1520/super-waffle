const express = require('express');
const axios = require('axios');
const cors = require('cors');
const pythonBridge = require('python-bridge');
// let python = pythonBridge({ python: 'C:/Users/91917/anaconda3/envs/super-waffle' });
const path = require('path');
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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


// });
// app.post('/predict', async (req, res) => {
//   console.log(req.body)
//   const userData = req.body;
//   const serverDir = __dirname;
//   python.ex`import os`;
//   python.ex`os.chdir(${serverDir})`;
//   python.ex`import pandas as pd`;
//   python.ex`import joblib`;
//   python.ex`import math`;
//   python.ex`model_filename = 'linear_regression_model.pkl'`;
//   const model = await python.ex`model = joblib.load(model_filename)`;
//   if (userData) {
//     await python.ex`current_user_data_df = pd.DataFrame([${userData}])`;
//     const predictedPricePython = await python.ex`predicted_price = model.predict(current_user_data_df)`;
//     const predictedPrice = await python`math.ceil(predicted_price[0])`;
//     res.json({ predictedPrice });
//   } else {
//     console.log('userData is not ready');
//   }

// });


});


const mysql = require("mysql");


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "super-waffle",
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate inputs here if needed

  const sql = "INSERT INTO login (username, password) VALUES (?, ?)";
  const values = [username, password];

  db.query(sql, values, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(201).json({ message: "User created successfully" });
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
app.listen(process.env.PORT || 5000);