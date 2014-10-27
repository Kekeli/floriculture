// index.js
module.exports = function(app, passport) {

        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        app.get('/', function(req, res) {
                res.render('index', { 
                	title : 'Welcome',
                	user : req.user
                } );
        });

        // =====================================
        // LOGIN ===============================
        // =====================================
        // show the login form
        app.get('/login', function(req, res) {

                // render the page and pass in any flash data if it exists
                res.render('login', { 
                	title : 'Please log on', 
                	user : req.user,
                	message : req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', 
            passport.authenticate('local-login', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/login', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
        }));

        // =====================================
        // SIGNUP ==============================
        // =====================================
        // show the signup form
        app.get('/signup', function(req, res) {

                // render the page and pass in any flash data if it exists
                res.render('signup.ejs', { 
                	title : 'Sign up!', 
                  user : req.user,
                	message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/signup', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
        }));

        // =====================================
        // PROFILE SECTION =========================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
                res.render('profile.ejs', {
                		title : 'User Profile',
                    user : req.user
                });
        });

        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
                req.logout();
                res.redirect('/');
        });

        // =====================================
        // ABOUT ===============================
        // =====================================
        app.get('/about', function(req, res) {
          res.render('about', { 
                title : 'About' ,
            	user : req.user
            });
        });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
                return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
}
