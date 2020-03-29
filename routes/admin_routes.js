var express = require('express');
var user = require("../database/models/user");
var router = express.Router();
var passport = require("passport");
var chatsim = require('../controllers/chatsim');

// Log out route
router.get("/chatsim/:toggle", function (req, res) {

    if (req.isAuthenticated()) {

        let toggle = req.params.toggle;
        if (toggle === "on") {
            chatsim.turnOn();
        } else if (toggle == "off") {
            chatsim.turnOff();
        };

    } else {
        res.send('not authenticated.');
    }

});

module.exports = router;