var express = require('express');
var app = express();

var sharejs = require('share');
var showdown = require('showdown');
var showdownHighlight = require('showdown-highlight')
var bodyParser = require('body-parser');

/* use ejs as the view engine */
app.set('view engine', 'ejs');

/* store assets */
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
/* routes for app */
app.get('/', function(request, response) {
  response.render('pad');
});

app.get('/(:id)', function(request, response) {
  response.render('pad');
});

app.post('/service',(req, res)=>{
  var content = req.body.content;
  converter = new showdown.Converter({
    extensions: [showdownHighlight]
  });
  var finalCont = converter.makeHtml(content);
  res.send(finalCont);
});

/* set up redis */
// set up redis server
var redisClient;
if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  redisClient = require("redis").createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  redisClient = require("redis").createClient();
}

/* configure shareJS */
sharejs.server.attach(app, {
  db: {type: 'redis'},
  client: redisClient
});

/* port 8000 or port used for heroku */
var port = process.env.PORT || 3000;
app.listen(port);
