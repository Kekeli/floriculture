// dependencies
var express = require('express');
var app = express();

var Config = require('./config/config');
var config = new Config();

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var methodOverride = require('method-override');

var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var partials = require('express-partials');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var multer = require('multer');

var port = process.env.PORT || 3000;

var dbUrl = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL || config.database.url;

var sessionSecret = process.env.SESSION_SECRET || 'some pig!';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(dbUrl, function(err) {
  if (err) {
    console.log('ERROR connecting to: ' + dbUrl + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + dbUrl);
  }
});

// pass passport for configuration
require('./config/passport')(passport);

// load the express-partials middleware
app.use(partials());

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

var done = false;
app.use(multer({
  dest: __dirname + '/uploads/',
  limits: {
    fileSize: 1000 * 1024
  },
  onFileUploadStart: function(file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function(file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done = true;
  }
}));

app.use(cookieParser());
app.use(session({
  cookie: {maxAge: 60000},
  resave: true,
  saveUninitialized: true,
  secret: sessionSecret,
  store: new mongoStore({
    url: dbUrl,
    collection : 'sessions'
  })
})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler({dumpExceptions : true, showStack : true}));
  app.locals.pretty = true;
}

// put user into res.locals for easy access from templates
app.all('*', function(req, res, next) {

  res.locals.user = req.user || null;
  next();
});

// Helpers
app.locals.errors = {};
app.locals.message = {};

// Routes
var router = require('./app/routes/index.js');

app.use('/', router);

// Error handling
// router.all('*', function(req, res) {
//   res.sendStatus(404);
// })

// the meat and potatoes
http.createServer(app).listen(port, function() {
  console.log('Listening on port %d in %s mode', port, app.settings.env);
});

// expose app
exports = module.exports = app;
