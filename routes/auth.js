var express = require('express');
var user = require("../database/models/user");
var router = express.Router();
var passport = require("passport");

// Log out route
router.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.send({ loggedIn: false, user: null });
    })
});

// Returns user info (from the session data) if the user is authenticated.
router.get("/user", function (req, res) {
    // console.log('user route');
    if (req.isAuthenticated()) {
        // console.log(JSON.stringify(req.session.passport.user.user.username, null, 3));
        console.log(req.session.passport.user.user.username + " just logged in.");
        res.send({loggedIn: true, data: req.session.passport.user });
    } else {
        console.log('User not logged in.')
        res.send('not authenticated.');
    }
});

// Log in a user
router.post("/login", passport.authenticate("local", {
    failureflash: true
}), function (req, res) {
    req.session.save(function () {
        console.log(req.session.passport.user);
        console.log('login route callback')
        res.send({ loggedIn: true, user: req.session.passport.user });
    });
});
// Regiser a new user.
router.post("/register", function (req, res) {

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        console.log(JSON.stringify(errors));

        let usernameErrors = [];
        let emailErrors = [];
        let passwordErrors = [];
        let passwordMatchErrors = [];

        errors.forEach(function (element) {
            switch (element.param) {
                case "username":
                    usernameErrors.push(element);
                    break;
                case "email":
                    emailErrors.push(element);
                    break;
                case "password":
                    passwordErrors.push(element);
                    break;
                case "passwordMatch":
                    passwordMatchErrors.push(element);
                default:
            }
        });

        res.send({
            usernameErrors: usernameErrors,
            emailErrors: emailErrors,
            passwordErrors: passwordErrors,
            passwordMatchErrors: passwordMatchErrors,
        });
    } else {

        user.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }).then(function (data) {

            req.login({ loggedIn: true, user: data}, function (err) {

                if (err) throw err;

                res.send({ loggedIn: true, user: {user: data}});

                // req.app.Mailer.sendMail({
                //     from: "pandoChat",
                //     to: 'shaneechambry@gmail.com',  //Change to email address that you want to receive messages on
                //     subject: 'Someone Created an Account on pandoChat!',
                //     text: 'email: ' + req.body.email
                //   });

            });

        }).catch(function (err) {

            if (err) 
            {console.log(err)};

            res.send({ emailErrors: ['This email is already associated with an account.'] });

        });

    };
});

// Session parse middleware:
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}

module.exports = router;