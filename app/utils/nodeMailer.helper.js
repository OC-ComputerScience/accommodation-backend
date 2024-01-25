//import nodemailer
const nodemailer = require('nodemailer');

exports.sendEmail = (recipient, subject, body) => {
    console.log("Inside nodemailerhelper");
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', auth: {
            user: 'teamfoursoftware@gmail.com',
            pass: 'arqn rgcs ckbn bmsg'
        }
    });

    // Create email
    const mailOptions = {
        from: transporter.user,
        to: recipient,
        subject: subject, text: body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}