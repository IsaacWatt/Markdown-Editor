var express = require('express');
var app = express();

var sharejs = require('share');
var redis = require("redis");

/* use ejs as the view engine */
app.set('view engine', 'ejs');

/* store assets */
app.use(express.static(__dirname + '/public'));

/* routes for app */
app.get('/', function(request, response) {
  response.render('pad');
});

app.get('/(:id)', function(request, response) {
  response.render('pad');
});

/* configure shareJS */
sharejs.server.attach(app, {
  db: {type: 'redis'}
});

/* port 8000 or port used for heroku */
var port = process.env.PORT || 3000;
app.listen(port);
