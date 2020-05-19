var express = require('express');
var user = require("../database/models/user");
var router = express.Router();
var passport = require("passport");

// Log out route
router.get("/chatsim/:toggle", function (req, res) {

    let chatsim = req.app.chatsim;

    let userType = req.session.passport.user.user.type;

    if (req.isAuthenticated() && userType === 'ADMIN') {

        let toggle = req.params.toggle;
        if (toggle === "on") {
            chatsim.turnOn();
        } else if (toggle == "off") {
            chatsim.turnOff();
        };
        res.status(200).send();

    } else if ( req.isAuthenticated() ){
        res.status(403).send('not authorized.');
    } else {
        res.status(401).send('not authenticated.');
    }

});

router.get("/chatsim", function (req, res) {
    let chatsim = req.app.chatsim;

    res.status(200).send(chatsim.on);
});

module.exports = router;