module.exports = (app) => {
    const utils = require("../controllers/util.controller.js");
    var router = require("express").Router();
    const emailAdmin = require("../utils/emailAdmin.js");
    const emailHelper = require("../utils/email.helper.js");

    // router.post("/sendFacultyEmails", utils.sendEmails)
    // router.post("/emailChapel", utils.sendEmails)

    router.post("/emailFaculty", (req, res) => {
        emailHelper.emailFaculty(req.body.studentId, req.body.semesterId);
        res.send({ message: "Faculty email sent" });
      });
      
      router.post("/emailChapel", (req, res) => {
        emailAdmin.emailChapel(req.body.emailData);
        res.send({ message: "Chapel email sent" });
      });
      

    app.use("/accommodations-t4/utils", router);
}