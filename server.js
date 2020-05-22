// Environment constiables
require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Authentication
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");
const expressValidator = require("express-validator");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const sharedsession = require("express-socket.io-session");

let Mailer = require('./controllers/Mailer')();
Mailer.verify();

const PORT = process.env.PORT || 3001;

// Models
const dbConnection = require('./database');
var user = require("./database/models/user");

// Make the server
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Middleware
app.use(cookieParser());
app.use(session({ secret: "keyboard cat", resave: false, store: new MongoStore({ mongooseConnection: dbConnection }), saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator());

io.use(sharedsession(session({ secret: "keyboard cat", resave: false, store: new MongoStore({ mongooseConnection: dbConnection }), saveUninitialized: false })));

// Routes
var authRoutes = require('./routes/auth.js');
app.use('/', authRoutes);
app.use('/', require('./routes/userRoutes'));
app.use('/admin', require('./routes/admin_routes'));

// Passport strategies
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    // Search the database for the user.
    user.findOne({ email: email }).then(function (results, err) {

        if (err) { return done(err); };

        if (!results) {
            // If there are no results, authentication failure.
            done(null, false, { message: "Email not found." });
        } else {

            const returnedUser = new user(results);

            if (returnedUser.checkPassword(password)) {
                // If the password is correct, log in.
                return done(null, { loggedIn: true, user: results});
            } else {
                // If the password is incorrect, authentication failure.
                return done(null, false, { message: 'incorrect password.'});
            }
        }
    });
}));

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Start the server.
server.listen(PORT, function () {
    console.log('Server listening on port: ' + PORT);
});

// Run the socket.io code.
require("./routes/socket_functions").startSocket(io);

app.chatsim = require('./controllers/chatsim')(io);
app.Mailer = Mailer;
