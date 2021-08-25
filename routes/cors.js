const express = require('express');
const cors = require('cors');

const whitelist = ['http://localhost:3001', 'http://localhost:3000', 'https://localhost:3443', 'https://localhost:3443/', 'http://Parags-MacBook-Pro.local:3001'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) != -1) {
        corsOptions = { origin: true };
    }
    else {
        console.log('Unable to access the react client')
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);