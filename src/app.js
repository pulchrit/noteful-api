require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const app = express();

const morganFormat = NODE_ENV === 'production' 
    ? 'tiny'
    : 'dev';
    
app.use(morgan(morganFormat));
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
    res.send("hey there, boilerplate");
});



// ! Keep this as the last middleware step!!
// Add error handler middleware, express 
// recognizes a 4 param middleware function
// as being for error handling.
app.use((error, req, res, next) => {
    let response;
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}};
    } else {
        console.error(error);
        response = {message: error.message, error}
    }
    res.status(500).json(response);
});


module.exports = app;