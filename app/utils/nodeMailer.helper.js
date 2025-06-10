const nodemailer = require("nodemailer");
const {getFilePath} = require("./fileStorage.helper");
const db = require("../models");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use another email provider
  auth: {
    user: process.env.TRANSPONDER_EMAIL,
    pass: process.env.TRANSPONDER_PW, // Use environment variables for security
  },
});

exports.sendEmail = (recipient, subject, body, attachmentFilenames = []) => {
  console.log("Inside nodemailerhelper");

  // Create email
  const mailOptions = {
    from: "studentsuccess@oc.edu",
    to: recipient,
    subject: subject,
    text: body.replace(/\\n/g, '\n'),
  };
  // Only add attachments if we have any filenames
  if (attachmentFilenames.length > 0) {
    mailOptions.attachments = attachmentFilenames.map((filename) => ({
      filename: filename,
      path: getFilePath(filename),
    }));
  }
  // add this section back to turn on sending emails via OC email server
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

exports.logEmail = (studAccId = null, category, studentId, recipient, body) => {
  
        const emailLog = {
          studAccId: studAccId,
          category: category,
          studentId: studentId,
          toEmailAddress: recipient,
          senderEmail: "studentsuccess@oc.edu",
          date: new Date(),
          messageContent: body.replace(/\\n/g, '\n'),
        };
        db.emailLog.create(emailLog)
        .then(console.log("Email log created"))
        .catch(err => {
            console.log({
                message: err.message || "Error creating email log"
            });
        });


};
