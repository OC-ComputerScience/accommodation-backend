module.exports = (app) => {
    const section = require("../controllers/section.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    //create a new section 
    router.post("/", [authenticate], section.create);

    //retrieve all sections 
    router.get("/", [authenticate], section.findAll);

    //retrieve a single section
    router.get("/:sectionId", [authenticate], section.findOne);

    //update a single section

    router.put("/:sectionId",[authenticate], section.update);

    router.delete("/:sectionId", [authenticate], section.delete);

    app.use("accommodation/sections", router);
}