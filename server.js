var express = require('express');
var app = express();

var sharejs = require('share');
var showdown = require('showdown');
var showdownHighlight = require('showdown-highlight')
var bodyParser = require('body-parser');
var markdownpdf = require('markdown-pdf');
var fs = require('fs');
var pdf = require('html-pdf');

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

app.post('/service',(request, response)=>{
  var content = request.body.content;
  converter = new showdown.Converter({
    extensions: [showdownHighlight]
  });
  var finalCont = converter.makeHtml(content);
  response.send(finalCont);
});

app.post('/downloadmd',(request, response)=>{
  var content = request.body.content;
  content += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/agate.min.css" />' + '\n';
  content += '<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">';
  var options = {
    format: 'Letter',
    "border": "50px",
  };
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var s = today.getSeconds();
  pdf.create(content, options).toFile(mm + '-' + dd + '-' + s + '-md.pdf', function(err, res) {
    console.log(res)
  });
});

/* set up redis */
var redisClient;
redisClient = require('redis').createClient(process.env.REDIS_URL);

/* configure shareJS */
sharejs.server.attach(app, {
  db: {
    type: 'redis',
    client: redisClient
  }
});

/* port 8000 or port used for heroku */
var port = process.env.PORT || 3000;
app.listen(port);
