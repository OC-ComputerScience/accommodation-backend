module.exports = (app) => {
    const emailMessage = require("../controllers/emailMessage.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    // Create a new email message
    router.post("/", [authenticate], emailMessage.create);

    // Get all email messages
    router.get("/", [authenticate], emailMessage.findAll);

    // Get email message by id
    router.get("/:id", [authenticate], emailMessage.findOne);

    // Update email message by id
    router.put("/:id", [authenticate], emailMessage.update);

    // Delete all email messages
    router.delete("/", [authenticate], emailMessage.deleteAll);

    app.use("/accommodations-t4/emailMessage", router)
}
