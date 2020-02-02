let colorController = require('../../controllers/colorController');
var user = require("../models/user");
let nameGenerator = require('project-name-generator');
const mongoose = require('mongoose');

const dbConnection = require('../../database');

dbConnection.dropDatabase((err, result) => {
    if (err) throw err;
    
    console.log("Database Dropped");

    user.create(createUserArray(10)).then(() => {
        console.log("seeded.")
        dbConnection.close();
    })

});

let createUserArray = function(numBots) {
    let userArray = [];

    for (let index = 0; index <= numBots; index++) {
        userArray.push({
            username: nameGenerator().dashed,
            email: 'BOT' + (index + 1) + '@mail.com',
            password: 'keyboardcat',
            color: colorController.randomColor(),
            type: 'BOT'
        })        
    };

    userArray.push({
        username: 'FlashPoint',
        email: 'shaneechambry@gmail.com',
        password: "Avengers!1",
        color: colorController.randomColor(),
        type: 'ADMIN'
    });

    return userArray;
}
