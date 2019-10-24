//-----------------------------------------------------------------------------
// Configure web sockets.
//-----------------------------------------------------------------------------
let randomSentence = require("random-sentence");
var user = require("../database/models/user");
// let randomColor = require('randomcolor');

var message = require("../database/models/messages");


module.exports = function (io) {
    let messageID;

    message.find({}).select("id").sort({ "id": -1 }).limit(1).exec(function (err, doc) {

        messageID = doc[0] == undefined ? 0 : doc[0].id; 
        
        console.log("messageid", messageID);
        io.sockets.on("connection", function (socket) {

            let username;
            if (socket.handshake.session.passport) {
                username = socket.handshake.session.passport.user.user.username;
            }

            messageID++;
            io.sockets.emit("chat-message", { id: messageID, username: username, msg: "User Connected" });

            socket.on("chat-message", function (incomingMessage) {

                messageArray = incomingMessage.msg.split(" ");
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

                    message.create({
                        text: incomingMessage.msg,
                        username: username,
                        id: messageID,
                        replyTo: incomingMessage.replyTo || null
                    }).then(function (data) {
                        console.log("message added to db");
                        io.sockets.emit("chat-message", { id: messageID, username: username, msg: incomingMessage.msg });
                    }).catch(function (err) {

                    });

                };
            });

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