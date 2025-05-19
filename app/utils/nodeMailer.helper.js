const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use another email provider
  auth: {
    user: process.env.TRANSPONDER_EMAIL,
    pass: process.env.TRANSPONDER_PW, // Use environment variables for security
  },
});

const sendAccommodationEmail = async (toEmail, subject, message) => {
  const mailOptions = {
    from: "studentsuccess@oc.edu",
    to: toEmail,
    subject: subject,
    text: "Dear student, \n\n Thank you for submitting your accommodation request. To proceed, please schedule an appointment with the Student Success Office using the link below: \n\n Schedule an Appointment:(https://www.oc.edu/academics/student-success/accessibility-resource-center) \n\n During your appointment, please bring all required documentation to support your request. \n\n If you have any questions, feel free to reach out. Best regards,  Student Success Team",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// module.exports = sendAccommodationEmail;
module.exports.sendAccommodationEmail = sendAccommodationEmail;

exports.sendEmail = (recipient, subject, body) => {
  console.log("Inside nodemailerhelper");
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or use another email provider
    auth: {
      user: process.env.TRANSPONDER_EMAIL,
      pass: process.env.TRANSPONDER_PW, // Use environment variables for security
    },
  });

  // Create email
  const mailOptions = {
    from: "studentsuccess@oc.edu",
    to: recipient,
    subject: subject,
    text: body,
  };
  console.log("Sending email : " + JSON.stringify(mailOptions, null, 2));
  // add this section back to turn on sending emails via OC email server
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
