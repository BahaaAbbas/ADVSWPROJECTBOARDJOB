const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// setup the server port
const port = process.env.PORT || 5000;

// parse request data content type application/x-www-form-rulencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse request data content type application/json
app.use(bodyParser.json());

// define root route
app.get('/', (req, res)=>{
    res.send('Hello World Board API');
});

// import board routes
const boardRoutes = require('./src/routes/board.route');

// create board routes
app.use('/board', boardRoutes);

// listen to the port
app.listen(port, ()=>{
    console.log(`NodeJS is running at port ${port}`);
});