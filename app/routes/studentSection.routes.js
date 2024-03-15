const { student } = require("../models");

module.exports = (app) => {
    const studentSection = require ("../controllers/studentSection.controller.js");
    const {authenticate} = require("../authorization/authorization.js");
    var router = require("express").Router();

    router.post("/", [authenticate], studentSection.create);

    router.get("/", [authenticate], studentSection.findAll);

    router.get("/:studentSectionId", [authenticate], studentSection.findOne);

    router.put(":/studentSectionId", [authenticate], studentSection.update);

    router.delete("/:studentSectionId", [authenticate], studentSection.delete);

    app.use("/accommodations-t4/studentSection", router);
};