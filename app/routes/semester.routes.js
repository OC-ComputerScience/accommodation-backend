module.exports = (app) => {
    const semesters = require("../controllers/semester.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    // Create a new semester
    router.post("/", [authenticate], semesters.create);

    // Retrieve all semesters
    router.get("/",  semesters.findAll);

    // Retrieve a single semester for a particular ID
    router.get("/id/:semesterId", [authenticate], semesters.findOne);

    // Retrieve a single semester for a particular season and year
    router.get("/:season/:year", [authenticate], semesters.findOneForSeasonYear);

    // Update a semester with ID
    router.put("/id/:semesterId", [authenticate], semesters.update);

    // Delete a semester with ID
    router.delete("/id/:semesterId", [authenticate], semesters.delete);

    app.use("/accommodations-t4/semesters", router);
};
