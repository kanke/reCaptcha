const express = require('express');
const axios = require('axios');
const http = require('http');
const util = require('util');

const app = express();

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/user', function(req, res, next) {
  console.log('Received request:');
  console.log(`Headers: ${JSON.stringify(req.headers)}`)
  console.log(`Body: ${JSON.stringify(req.body)}`)
  
  const config = {
    method: 'post',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    params: {
      secret: "******",
      response: req.body["g-recaptcha-response"]
    }
  }
  console.log(`Request data: ${util.inspect(config)}`)

  axios(config).then((status) => {
    console.log(`Received response from Google: ${util.inspect(status.data)}`);
    if (status.data.success === true) {
      res.status(200).send({'message': 'ok'});
    } else {
      res.status(405).send({'message': 'not-allowed'});
    }
  }).catch((error) => {
    console.log(`Received error from Google: ${error}`);
    res.status(500).send({'message': 'error'});
  });
});


app.set('port', 3000);

var server = http.createServer(app);
server.listen(3000);
