const emailHelper = require("../utils/email.helper.js");
const emailAdmin = require ("../utils/emailAdmin.js")


exports.sendEmails = (req, res) => {
  emailHelper.emailFaculty(req.body.studentId, req.body.semesterId);
  emailAdmin.emailCategoryTemplate(req.body.studentId, req.body.semesterId); 
}



