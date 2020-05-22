require('dotenv').config()
const nodemailer = require('nodemailer');

let Mailer = function () {
    this.transport = {
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    };
    this.transporter = nodemailer.createTransport(this.transport);
    this.verify = function () {
        this.transporter.verify((error, success) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take messages');
            }
        });
    };
    this.sendMail = function(mail) {
        this.transporter.sendMail(mail, (err, data) => {
            if (err) {
                throw err;
            } else {
                return data;
            }
        });
    }
    return this;
};

module.exports =  Mailer;