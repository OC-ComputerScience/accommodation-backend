module.exports = (app) => {
    const utils = require("../controllers/util.controller.js");
    var router = require("express").Router();

    router.post("/sendStaffEmails", utils.sendEmails)

    app.use("/utils", router);
}