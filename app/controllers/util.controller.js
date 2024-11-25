const emailHelper = require("../utils/email.helper.js");

exports.sendEmails = (req, res) => {
  if (!req.body.studentId || !req.body.semesterId) {
    res.status(400).send({
      message: "Missing required fields"
    });
    return;
  }
  emailHelper.emailStaff(req.body.studentId, req.body.semesterId).then(() => {
    res.status(200).send({
      message: "Emails sent successfully"
    });
  }).catch((err) => {
    res.status(500).send({
      message: "Error sending emails"
    });
  });
}
