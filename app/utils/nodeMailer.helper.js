//import nodemailer
const nodemailer = require('nodemailer');

exports.sendEmail = (recipient, subject, body) => {
    console.log("Inside nodemailerhelper");
    // Create transporter
    const transporter = nodemailer.createTransport({
 
    });

    // Create email
    const mailOptions = {
        from: 'studentsuccess@oc.edu',
        to: recipient,
        subject: subject, 
        text: body
    };
    console.log("Sending email : " + mailOptions);
    // add this section back to turn on sending emails via OC email server
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log('Error: ' + error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    //});
}