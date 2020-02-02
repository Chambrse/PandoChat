//-----------------------------------------------------------------------------
// Configure web sockets.
//-----------------------------------------------------------------------------
let randomSentence = require("random-sentence");
var user = require("../database/models/user");
var message = require("../database/models/messages");
var thread = require("../database/models/thread");

let threadColorIndex = 0;

let colorPallete =[
    {
        "hsl" : {
            "h" : 49.3827160493827,
            "s" : 1,
            "l" : 0.476470588235294,
            "a" : 1
        },
        "hex" : "#f3c800",
        "rgb" : {
            "r" : 243,
            "g" : 200,
            "b" : 0,
            "a" : 1
        },
        "hsv" : {
            "h" : 49.3827160493827,
            "s" : 1,
            "v" : 0.952941176470588,
            "a" : 1
        },
        "oldHue" : 264.935064935065,
        "source" : "hex"
    },{
        "hsl" : {
            "h" : 35.607476635514,
            "s" : 0.877049180327869,
            "l" : 0.52156862745098,
            "a" : 1
        },
        "hex" : "#f0991a",
        "rgb" : {
            "r" : 240,
            "g" : 153,
            "b" : 26,
            "a" : 1
        },
        "hsv" : {
            "h" : 35.607476635514,
            "s" : 0.891666666666667,
            "v" : 0.941176470588235,
            "a" : 1
        },
        "oldHue" : 264.935064935065,
        "source" : "hex"
    },{
        "hsl" : {
            "h" : 2.50000000000003,
            "s" : 0.134831460674157,
            "l" : 0.349019607843137,
            "a" : 1
        },
        "hex" : "#654e4d",
        "rgb" : {
            "r" : 101,
            "g" : 78,
            "b" : 77,
            "a" : 1
        },
        "hsv" : {
            "h" : 2.50000000000003,
            "s" : 0.237623762376238,
            "v" : 0.396078431372549,
            "a" : 1
        },
        "oldHue" : 264.935064935065,
        "source" : "hex"
    },{
        "hsl" : {
            "h" : 12.8571428571429,
            "s" : 0.578512396694215,
            "l" : 0.474509803921569,
            "a" : 1
        },
        "hex" : "#bf5133",
        "rgb" : {
            "r" : 191,
            "g" : 81,
            "b" : 51,
            "a" : 1
        },
        "hsv" : {
            "h" : 12.8571428571429,
            "s" : 0.732984293193717,
            "v" : 0.749019607843137,
            "a" : 1
        },
        "oldHue" : 264.935064935065,
        "source" : "hex"
    },{
        "hsl" : {
            "h" : 73.8842975206612,
            "s" : 0.626943005181347,
            "l" : 0.37843137254902,
            "a" : 1
        },
        "hex" : "#819d24",
        "rgb" : {
            "r" : 129,
            "g" : 157,
            "b" : 36,
            "a" : 1
        },
        "hsv" : {
            "h" : 73.8842975206612,
            "s" : 0.770700636942675,
            "v" : 0.615686274509804,
            "a" : 1
        },
        "oldHue" : 264.935064935065,
        "source" : "hex"
    }
];

module.exports = function (io) {
    let messageID;

    message.find({}).select("id").sort({ "id": -1 }).limit(1).exec(function (err, doc) {

        messageID = doc[0] == undefined ? 0 : doc[0].id;

        console.log("messageid", messageID);
        io.sockets.on("connection", function (socket) {

            let user;

            if (socket.handshake.session.passport) {
                user = {
                    _id: socket.handshake.session.passport.user.user._id,
                    username: socket.handshake.session.passport.user.user.username,
                    color: socket.handshake.session.passport.user.user.color
                }
                console.log(socket.handshake.session.passport.user.user);

                messageID++;
                io.sockets.emit("chat-message", { id: messageID, username: user.username, msg: "User Connected", user: user });

                socket.on("chat-message", function (message) { messageReceivedHandler(message, user) });
            }

        });
    });

    function messageReceivedHandler(incomingMessage, user) {

        // do admin stuff if applicable
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

            //no matter what, increment the messageID
            messageID++;

            // console.log(incomingMessage.replyTo.user.username);
            // console.log(user.username);
            // console.log(incomingMessage.replyTo.user.username !== user.username);
            // console.log(incomingMessage);
            //if this message is a reply
            if (incomingMessage.replyTo && ((incomingMessage.replyTo.user.username !== user.username) || incomingMessage.replyTo.thread)) {
                // console.log(incomingMessage.replyTo.user.username);
                // console.log(user.username);
                // console.log(incomingMessage.replyTo.user.username !== user.username);
                console.log(incomingMessage.replyTo);
                console.log("this is a reply")
                // if the message that this is a reply to is already part of a thread
                if (incomingMessage.replyTo.thread !== null) {
                    console.log("continuing thread");
                    // update the thread
                    message.create({
                        text: incomingMessage.msg,
                        username: user.username,
                        user: user._id,
                        id: messageID,
                        color: incomingMessage.replyTo.color,
                        replyTo: incomingMessage.replyTo ? incomingMessage.replyTo.objectId : null,
                        thread: incomingMessage.replyTo.thread.objectId
                    }).then(function (messagedata) {

                        thread.findByIdAndUpdate(incomingMessage.replyTo.thread.objectId, { "$push": { "messages": messagedata._id } }).then(function (updatedThread) {

                            io.sockets.emit("chat-message", {
                                id: messageID,
                                objectId: messagedata._id,
                                username: user.username,
                                user: user,
                                msg: incomingMessage.msg,
                                replyToId: incomingMessage.replyTo.id,
                                thread: {
                                    objectId: updatedThread._id,
                                    color: updatedThread.color
                                }
                            });
                        });

                    });

                } else if (incomingMessage.replyTo.user.username !== user.username) {
                    //create new thread
                    console.log("new thread");

                    if (threadColorIndex >= colorPallete.length - 1) {
                        threadColorIndex = 0;
                    } else {
                        threadColorIndex++;
                    }

                    message.create({
                        text: incomingMessage.msg,
                        username: user.username,
                        user: user._id,
                        id: messageID,
                        color: incomingMessage.replyTo.color,
                        replyTo: incomingMessage.replyTo ? incomingMessage.replyTo.objectId : null
                    }).then(function (messagedata) {
                        thread.create({
                            originalMessage: incomingMessage.replyTo.objectId,
                            color: colorPallete[threadColorIndex],
                            messages: [incomingMessage.replyTo.objectId, messagedata._id]
                        }).then(function (data) {

                            io.sockets.emit("chat-message", {
                                id: messageID,
                                objectId: messagedata._id,
                                username: user.username,
                                user: user,
                                msg: incomingMessage.msg,
                                replyToId: incomingMessage.replyTo.id,
                                thread: {
                                    objectId: data._id,
                                    color: data.color
                                },
                                newThread: true
                            });
                            message.updateMany({ _id: { $in: [incomingMessage.replyTo.objectId, messagedata._id] } }, { thread: { objectId: data._id, color: data.color } });
                        });
                    });

                } else {
                    
                }
            } else {
                // console.log("no thread");

                //send normal message
                sendNormalMessage(incomingMessage, user);
            }



        };
    }


    function sendNormalMessage(incomingMessage, user) {
        message.create({
            text: incomingMessage.msg,
            username: user.username,
            id: messageID,
            user: user._id,
            color: user.color,
            replyTo: null,
            thread: null
        }).then(function (data) {

            io.sockets.emit("chat-message", {
                id: messageID,
                objectId: data._id,
                username: user.username,
                user: user,
                msg: incomingMessage.msg,
                thread: null
            });

        }).catch(function (err) {
            if (err) throw err;
        });
    }




    function chatSim() {

        user.find({ type: "BOT"}).then((botUsers) => {
            console.log(botUsers);
            sendBotMessage(botUsers);
        });
    };

    function sendBotMessage(botUsers) {
        new Promise(function (resolve, reject) {
            let userForThisMessage = botUsers[Math.floor(Math.random() * botUsers.length)];
            if (simOn) {
                setTimeout(function () {
                    messageReceivedHandler({
                        msg: randomSentence({ min: 2, max: 15 }),
                        user: {username: userForThisMessage.username, color: userForThisMessage.color},
                        replyTo: null
                    }, userForThisMessage);
                    resolve();
                }, Math.ceil(Math.random() * 1000));
            }
        }).then(() => {
            sendBotMessage(botUsers);
        });
    };

    function sendSingleRandomMessage() {
        messageID++;
        io.sockets.emit("chat-message", { id: messageID, msg: randomSentence({ min: 2, max: 15 }), username: randomSentence({ min: 1, max: 1 }) });
    }

};