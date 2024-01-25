const { student } = require("../models/index.js");

module.exports = (app) => {
    const studentAccom = require ("../controllers/studentAccom.controller.js");
    const {authenticate} = require("../authorization/authorization.js");
    var router = require("express").Router();

    router.post("/", studentAccom.create);

    router.get("/", [authenticate], studentAccom.findAll);

    router.get("/:studentAccomId", [authenticate], studentAccom.findOne);

    router.get("/studentId/:studentId", [authenticate], studentAccom.findAllForStudent);

    router.get("/semester/:semester", [authenticate], studentAccom.findAllForSemester)

    router.put(":/studentAccomId", [authenticate], studentAccom.update);

    router.delete("/:studentAccomId", [authenticate], studentAccom.delete);

    router.delete("/", [authenticate], studentAccom.deleteAll);

    app.use("/accommodations-t4/studentAccom", router);
};