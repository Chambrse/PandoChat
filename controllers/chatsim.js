var user = require("../database/models/user");
var socket = require('../routes/SocketController');
let randomSentence = require("random-sentence");

function chatSimFunction(socket) {


    let chatSim = {
        on: false,
        io: socket.io,
        speed: 3,
        getSpeed: () => {
            return chatSim.speed;
        },
        setSpeed: (newSpeed) => {
            chatSim.speed = newSpeed;
        },
        turnOff: () => {
            chatSim.on = false;
        },
        turnOn: () => {
            if (!chatSim.on) {
                chatSim.chatSim();
            }
            chatSim.on = true;
            chatSim.io = socket.io;
        },
        chatSim: () => {
            // console.log("this si foing");
            user.find({ type: "BOT"}).then((botUsers) => {
                chatSim.sendBotMessage(botUsers);
            });
        },
        sendBotMessage: (botUsers) => {
            new Promise(function (resolve, reject) {
                let userForThisMessage = botUsers[Math.floor(Math.random() * botUsers.length)];
                if (chatSim.on) {
                    setTimeout(function () {
                        socket.messageReceivedHandler({
                            msg: randomSentence({ min: 2, max: 15 }),
                            user: {username: userForThisMessage.username, color: userForThisMessage.color},
                            replyTo: null
                        }, userForThisMessage, chatSim.io);
                        resolve();
                    }, Math.ceil(Math.random() * 1000));
                }
            }).then(() => {
                chatSim.sendBotMessage(botUsers);
            });
        }
    };

    return chatSim;
    
};


module.exports = chatSimFunction;

