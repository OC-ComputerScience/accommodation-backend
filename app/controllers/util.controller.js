const emailHelper = require("../utils/email.helper.js");

exports.sendEmails = (req, res) => {
  emailHelper.emailFaculty(req.body.studentId, req.body.semesterId);
}
