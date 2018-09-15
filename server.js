var express = require('express');
var app = express();

var sharejs = require('share');
const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
var katex = require('katex');
var bodyParser = require('body-parser');
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
  var converter = new showdown.Converter({
    extensions: [showdownHighlight]
  });

  var finalCont = converter.makeHtml(content);
  console.log(finalCont);
  finalCont = finalCont.replace(new RegExp('hljs ', 'g'), '');

  function replacer(match, string) {
    console.log('here', match);
    match = match.replace(new RegExp('tx ', 'g'), '');
    match = match.replace(new RegExp(' tx', 'g'), '');
    return katex.renderToString(match, {
      throwOnError: false
    });
  }

  var newString = finalCont.replace(/tx.*tx/g,replacer);
  response.send(newString);
});

app.post('/downloadmd',(request, response) => {
  var content = request.body.content;
  content += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-seaside-light.min.css" />'
  content += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.css" integrity="sha384-D+9gmBxUQogRLqvARvNLmA9hS2x//eK1FhVb9PiU86gmcrBrJAQT8okdJ4LMp2uv" crossorigin="anonymous">';
  content += `<style>
    pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .katex {
    width: 100%;
    display: block;
  }
  p code {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
  }
    </style>`;
  var options = {
    format: 'Letter',
    "border": "50px",
    "directory": "/Markdown-Notes"
  };
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var s = today.getSeconds();

  pdf.create(content, options).toFile('../../../Markdown-Notes' + dd + '-' + mm + '-' + s + '-' + 'notes-md.pdf', function(err, res) {
    response.send(res);
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
