const nodemailer = require("nodemailer");
const {getFilePath} = require("./fileStorage.helper");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use another email provider
  auth: {
    user: process.env.TRANSPONDER_EMAIL,
    pass: process.env.TRANSPONDER_PW, // Use environment variables for security
  },
});

exports.sendEmail = (recipient, subject, body, filenames = []) => {
  console.log("Inside nodemailerhelper");

  // Create email
  const mailOptions = {
    from: "studentsuccess@oc.edu",
    to: recipient,
    subject: subject,
    text: body.replace(/\\n/g, '\n'),
  };
  // Only add attachments if we have any filenames
  if (filenames.length > 0) {
    mailOptions.attachments = filenames.map((filename) => ({
      filename: filename,
      path: getFilePath(filename),
    }));
  }
  // add this section back to turn on sending emails via OC email server
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
