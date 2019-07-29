var express = require('express');

var app = express();
app.use(express.static('static'));
app.listen(3000);

console.log('Server running at http://127.0.0.1:3000/')
