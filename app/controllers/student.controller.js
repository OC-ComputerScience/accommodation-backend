const db = require("../models");
const Student = db.student;
const Op = db.Sequelize.Op;

//create a new student and add it to the database
exports.create = (req, res) => {
    if(!req.body.studentId){
        res.status(400).send({
            message: 'Content cannot be empty!',
        });
        return;
    }

    const student = {
        studentId: req.body.studentId,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        //change this to always be 1 if we don't allow a student to use the system without signing
        permission: req.body.permission, 
        dateSigned: new Date(),
        version: req.body.version,
    };
    Student.create(student)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred whilst creating the student"
            });
        });
};

//retrieve all students from the database
exports.findAll = (req, res) => {
    const studentId = req.query.studentId;
    var condition = studentId ? {studentId: {[Op.like]: `%${studentId}%`}} : null;
    Student.findAll({ where: condition})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                err.message || "Some error occurred whilst retrieving students"

            });
        });
};

//find a single student with an id
exports.findOne = (req, res) => {
    //const id = parseInt(req.params.id);
    const id = req.params.studentId;
    Student.findByPk(id)
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Student with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error retrieving Student with id=" + studentId,
        });
      });
 };

 exports.findOneForEmail = (req, res) => {
    const email = req.params.email;
    Student.findAll({where: {email: email}})
      .then((data) => {
        if(data.length > 0){
          res.send(data);
        }
        else{
          res.status(404).send({
            message: `cannot find ${email}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 
            err.message || 'Error retrieving '+email,
        });
      });
 };

//update a student by the id in the request
exports.update = (req, res) => {
    const id = req.params.studentId;
    Student.update(req.body, {
      where: { studentId: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "student was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update student with id=${id}. Maybe student was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating student with id=" + id,
        });
      });
};

// Delete a student with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.studentId;
    Student.destroy({
      where: { studentId: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "student was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete student with id=${id}. Maybe student was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete student with id=" + id,
        });
      });
};

// Delete all students from the database.
exports.deleteAll = (req, res) => {
    Student.destroy({
      where: {},
      truncate: false,
    })
      .then((nums) => {
        res.send({ message: `${nums} Students were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all students.",
        });
      });
  };