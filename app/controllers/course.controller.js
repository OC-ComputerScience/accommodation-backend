const db = require("../models");
const Course = db.course;
const Op = db.Sequelize.Op;

//create and save a new course

exports.create = (req, res) => {
    //validate request
    if(!req.body.courseNumber) {
        res.status(400).send({
            message: "Content cannot be empty",
        });
        return;
    }
    console.log("inside course.controller.js create function");

    //create a course

    const course = {
        description: req.body.description,
    };
    //save course in the database

    Course.create(course)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error occured while creating a course",

            });
        });
};

//retrieve all courses from the database
exports.findAll = (req, res) => {
    const id = req.query.courseNumber; //may need to change query.id to query.courseNumber
    var condition = id ? {id: { [Op.like]: `%${id}%` } } : null;

    Course.findAll({where: condition})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving the courses",
            });
        });
};

//Find a single course with a courseNumber

exports.findOne = (req, res) => {
    const id = req.params.courseNumber;

    Course.findByPk(id)
        .then((data) =>{
            if(data){
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find course with id=${id}`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retrieving course with id=" + id,
            });
        });
};

//delete a course with the specified courseId in the request

exports.delete = (req, res) => {
    const id = req.params.courseNumber;

    Course.destroy({
        where: {courseNumber: id},
    })
    .then((num) => {
        if(num == 1){
            res.send({
                message: "course was successfully deleted",
            });
        } else {
            res.send({
                message: `Cannot delete course with courseNumber=${id}. `,
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            message: "Could not delete course with courseNumber = " + id,
        });
    });
};


//update a course 
exports.update = (req, res) => {
    const id = req.params.courseNumber;

    Course.update(req.body, {
        where: {courseNumber: id},
    })
        .then((num) => {
            if(num ==1){
                res.send({
                    message: "Course was successfully updated",
                });
            } else{
                res.send({
                    message: `Cannot update course with courseNumber=${id}. It may be that this course does not exist or req.body is empty`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "error updating course with id = " + id
            });
        });
};