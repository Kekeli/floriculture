/**
 * Module dependencies.
 */

var express = require('express')
	, app = express()
	, path = require('path')
	, http = require('http')
	, mongoStore = require('connect-mongo')(express)
	, partials = require('express-partials')
	, passport = require('passport')
	, flash = require('connect-flash')
	;

var db = require('./config/db');
new db.startup();
require('./config/passport')(passport); // pass passport for configuration



app.configure(function() {
  // todo: kill off the partials crutch
  // and go all Express 3ish with Jade?
  // load the express-partials middleware
  app.use(partials());

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(require('less-middleware')( path.join(__dirname, 'public') ));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser('some pig!'));
  app.use(express.session({
    cookie: {maxAge: 60000}, 
    secret: 'some pig!',
    store: new mongoStore({
          url: 'mongodb://localhost/greenhouse',
          collection : 'sessions'
        })
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);

  // development only
  if ('development' == app.get('env')) {
    app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
    app.locals.pretty = true;
    // sendgrid = {
    //  send: function(opts, callback) {
    //    console.log('Email:', opts);
    //    callback(true, opts);
    //  }
    // }
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
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
require('./app/routes/index.js')(app, passport); 
require('./app/routes/plants.js')(app, passport); 

// Error handling
app.all('*', function(req, res){
  res.send(404);
})

// the meat and potatoes
http.createServer(app).listen(app.get('port'), function(){
  console.log( 'Express server listening on port %d in %s mode', app.get('port'), app.settings.env );
});
