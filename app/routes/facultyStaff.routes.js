//const { facultySection } = require("../models");
//im not sure why line one is here and I dont know if it is important so im just gonna comment it out
module.exports = (app) => {
    const facultyStaff = require ("../controllers/facultyStaff.controller.js");
    const {authenticate} = require("../authorization/authorization.js");
    var router = require("express").Router();

    //create a new member of faculty
    router.post("/", [authenticate], facultyStaff.create);

    //retrieve all faculty
    router.get("/", [authenticate], facultyStaff.findAll);

    //retrieve faculty by id
    router.get("/:id", [authenticate], facultyStaff.findOne);

    //update a faculty member
    router.put("/:id", [authenticate], facultyStaff.update);

    //delete a faculty member
    router.delete("/:id", [authenticate], facultyStaff.delete);

    //delete all faculty memebers
    router.delete("/", [authenticate], facultyStaff.deleteAll);

    app.use("/accommodations-t4/facultyStaffs", router)


}