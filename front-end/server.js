const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// var proxy = require('express-http-proxy');

// API file for interacting with MongoDB
const api = require('./server/routes/api');



log("sdsds")

// passport
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./config/passport')(passport);
const constants = require('./config/constants');

// cors
var proxy = require('http-proxy-middleware');
var cors_proxy = require('cors-anywhere');


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location

app.use('/api', api);
// app.use('/api', proxy({target: 'https://maps.googleapis.com', changeOrigin: true}));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);
// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port,() => console.log(`Running on localhost:${port}`));
