var express = require('express');
var user = require("../database/models/user");
var router = express.Router();
var passport = require("passport");

router.put("/user", authenticationMiddleware(), function (req, res) {
    console.log(req.session.passport.user);
    console.log(req.body);

    user.findOne({ _id: req.session.passport.user.user._id }).then((data) => {
        let currentUser = data;
        currentUser.color = req.body.color;
        user.updateOne({ _id: currentUser._id }, currentUser, function () {
            
            req.session.passport.user.user = currentUser;
            req.session.save(() => {
                res.send({ loggedIn: true, user: currentUser });
            });

        });

    });

});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}

module.exports = router;