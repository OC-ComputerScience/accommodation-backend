module.exports = (app) => {
    const utils = require("../controllers/util.controller.js");
    var router = require("express").Router();

    router.post("/sendFacultyEmails", utils.sendEmails)

    app.use("/accommodations-t4/utils", router);
}