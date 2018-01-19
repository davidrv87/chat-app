"use strict";

require('./config/config');

const path       = require('path');
const express    = require('express');

const publicPath = path.join(__dirname, '../public');
var port = process.env.PORT;

var app = express();

// Serve the public directory
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});