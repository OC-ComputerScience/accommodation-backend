module.exports = (app) => {
    const students = require ("../controllers/student.controller.js");
    const {authenticate} = require("../authorization/authorization.js");
    var router = require("express").Router();

    //create a new student
    router.post("/", [authenticate], students.create);

    //retrieve all students
    router.get("/", [authenticate],students.findAll);
    
    //Retrieve a single student for a particular id
    router.get("/id/:studentId", [authenticate], students.findOne);

    //retrieve a single student for a particular email
    router.get("/email/:email", [authenticate], students.findOneForEmail);

    //update a student with id
    router.put("/id/:studentId", [authenticate], students.update);

    //delete a student with id
    router.delete("/id/:studentId", [authenticate], students.delete);

    //delete all students
    router.delete("/", [authenticate], students.deleteAll);

    app.use("/accommodations-t4/students", router);
};