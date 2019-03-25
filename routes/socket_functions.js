//-----------------------------------------------------------------------------
// Configure web sockets.
//-----------------------------------------------------------------------------
let randomSentence = require("random-sentence");
var user = require("../database/models/user");
// let randomColor = require('randomcolor');


module.exports = function (io) {
    let messageID = 0;

    io.sockets.on("connection", function (socket) {

        let username;
        if (socket.handshake.session.passport) {
            username = socket.handshake.session.passport.user.user.username;
        }

        messageID++;
        io.sockets.emit("chat-message", { id: messageID, username: username, msg: "User Connected" });

        socket.on("chat-message", function (message) {

            messageArray = message.msg.split(" ");
            if (messageArray[0] === "admin") {
                switch (messageArray[1]) {
                    case "chatsim":
                        simOn = true;
                        chatSim();
                        break;
                    case "simOff":
                        simOn = false;
                        break;
                    case "sendOneRandom":
                        sendSingleRandomMessage();
                        break;

                    default:
                        break;
                }
            } else {
                messageID++;
                io.sockets.emit("chat-message", { id: messageID, username: username, msg: message.msg });
            };
        });

    });


    function chatSim() {

        if (simOn) {
            messageID++;
            new Promise(function (resolve, reject) {
                setTimeout(function () {
                    io.sockets.emit("chat-message", { id: messageID, msg: randomSentence({ min: 2, max: 15 }), username: randomSentence({ min: 1, max: 1 }) });
                    resolve();
                }, Math.ceil(Math.random() * 1000));

            }).then(function () {
                chatSim();
            });
        };

    };

    function sendSingleRandomMessage() {
        messageID++;
        io.sockets.emit("chat-message", { id: messageID, msg: randomSentence({ min: 2, max: 15 }), username: randomSentence({ min: 1, max: 1 }) });
    }

};