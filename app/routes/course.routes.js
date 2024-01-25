module.exports = (app) => {
    const course = require("../controllers/course.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    //create a new course
    router.post("/", [authenticate], course.create);
    
    //retrieve all courses
    router.get("/", [authenticate], course.findAll);

    // retrive a single course by its course number
    router.get("/:courseNumber", [authenticate], course.findOne);

    //update a single course by its course number
    router.put("/:courseNumber", [authenticate], course.update);

    //delete a course by its course number
    router.delete("/:courseNumber", [authenticate], course.delete);

    //delele all of the courses
    router.delete("/", [authenticate], course.deleteAll);

    app.use("/accommodation/courses", router);

}