var express      = require('express');
var favicon      = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var _            = require('lodash');
var fs           = require('fs-extra');
var Xray         = require('x-ray');
var basicAuth    = require('basic-auth-connect');

var config = require(__dirname + '/lib/config');

var app = express();
if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD) {
  app.use(basicAuth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD));
}
app.set('config', config);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// set local variables
app.locals.title    = config.app.title;
app.locals.port     = config.app.port;
app.locals.services = config.services;

/*
 * GET index
 */
app.get('/', function(req, res, next) {

  var enabledServices = _.filter(res.app.locals.services, function(item) {
    return (item.url !== undefined && item.url !== '');
  });

  res.render('index', {
    title: res.app.locals.title,
    enabledServices: _.sortBy(enabledServices, 'sort'),
    allServices: _.sortBy(res.app.locals.services, 'sort')
  });
});

/*
 * GET commits
 */
app.get('/commits', function(req, res, next) {

  var scraper = new Xray();
  scraper('https://github.com/onedr0p/manage-this-node/commits/master',
    '.table-list-cell',
    [{
      title: '.commit-title',
      author: 'a.commit-author',
      date: 'time'
    }]
  )(function(err, result){
    var commitLog = [];
    _.forEach(result, function(n, key) {

      var commitTitle = n.title.trim();
      commitTitle = commitTitle.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]+/g, '');

      commitLog.push({
        title: commitTitle.trim(),
        author: n.author.trim(),
        date: n.date.trim()
      });
    });

    // send json to front-end
    res.send(commitLog);
  });
});

/*
 * POST settings
 */
app.post('/', function(req, res) {

  var services = [];
  _.forEach(req.body.services, function(n, key) {
    var _id  = n._id;
    var name = n.name;
    var url  = n.url;
    var icon = n.icon;
    var sort = n.sort || null;

    var defaultPage = false;
    if (_id == req.body.default) {
      defaultPage = true;
    }

    services.push({
      '_id'    : _id,
      'name'   : name,
      'url'    : url,
      'icon'   : icon,
      'sort'   : parseInt(sort, 10),
      'default': defaultPage
    });
  });

  // update for session
  res.app.locals.title    = req.body.title;
  res.app.locals.services = services;

  // write file with the follow  contents
  fs.writeJsonSync(__dirname + '/config.json', {
    'app': {
      'title'   : req.body.title,
      'port'    : req.body.port,
      'version' : config.app.version
    },
    'services': services
  });

  // redirect to home
  res.redirect('back');
});

module.exports = app;
