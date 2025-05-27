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

  router.post("/emailChapel", async (req, res) => {
    try {
      await emailAdmin.emailCategoryTemplate(
        req.body.studentId,
        req.body.semesterId,
        req.body.accomCatIds
      );
      res.send({ message: "Chapel email sent" });
    } catch (error) {
      console.error("Error sending chapel email:", error);
      res.status(500).send({
        error: "Failed to send chapel email",
        details: error.message,
      });
    }
  });

  app.use("/accommodations-t4/utils", router);
};
