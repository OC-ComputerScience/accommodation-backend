module.exports = (app) => {
    const emailLog = require("../controllers/emailLog.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new Email Log
    router.post("/", [authenticate], emailLog.create);
  
    // Retrieve all People
    router.get("/", [authenticate], emailLog.findAll);
  
    // Retrieve a single emailLog with id
    router.get("/:emailLogId", [authenticate], emailLog.findOne);
  
    // Update a emailLog with id
    router.put("/:emailLogId", [authenticate], emailLog.update);
  
    // Delete a emailLog with id
    router.delete("/:emailLogId", [authenticate], emailLog.delete);
  
    // Delete all emailLog
    router.delete("/", [authenticate], emailLog.deleteAll);
  
    app.use("/accommodation/emailLog", router);
  };