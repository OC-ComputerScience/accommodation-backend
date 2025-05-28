const db = require("../models");
const StudentAccom = db.studentAccom;
const Accom = db.accommodation;
const Semester = db.semester;
const Student = db.student;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

  const selectedAccommodations = req.body.studentAccoms;
  try {
    const semester = await Semester.findOne({
      where: {
        semesterId: req.body.semesterId,
      },
    });

    const student = await Student.findOne({
      where: {
        studentId: req.body.studentId,
      },
    });

    if (!semester || !student) {
      res.status(404).send({
        message: "semester or student or accommodation not found",
      });
      return;
    }
    //delete all studentAccoms for this student and semester
    //a student can only have one accommodation request approved per semester
    await StudentAccom.destroy({
      where: {
        studentId: student.studentId,
        semesterId: semester.semesterId,
      },
    });

    // Step 2: Build all student accommodations
    const studentAccoms = selectedAccommodations.map((accom) => ({
      accomId: accom.accomId,
      data: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      semesterId: semester.semesterId,
      studentId: student.studentId,
    }));

    // Step 3: Bulk create them all at once
    const createdRequests = await StudentAccom.bulkCreate(studentAccoms);

    res.send(createdRequests);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "some error occurred whilst creating the student accommodation",
    });
  }
};

//retrieve all studentAccoms from the database
exports.findAll = (req, res) => {
  const studentAccomId = req.query.studentAccomId;
  var condition = studentAccomId
    ? { studentAccomId: { [Op.like]: `%${studentAccomId}%` } }
    : null;
  StudentAccom.findAll({
    include: { all: true },
    where: condition,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whilst retrieving student accoms",
      });
    });
};

//find a single request with an id
exports.findOne = (req, res) => {
  const id = req.params.studentAccomId;
  StudentAccom.findByPk(studentAccomId)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find student accom with id=${studentAccomId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving student accom with id=" + studentAccomId,
      });
    });
};
exports.findAllForStudent = (req, res) => {
  const studentId = req.params.studentId;
  StudentAccom.findAll({
    where: { studentId: studentId },
    include: [
      { model: db.accommodation },
      { model: db.semester },
      { model: db.student },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message:
            err.message ||
            `Cannot find accommodations for student ${studentId}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "error retrieving accommodations for student " + studentId,
      });
    });
};

exports.findAllForSemester = async (req, res) => {
  const semesterId = req.params.semesterId; // Use semesterId directly from the URL parameter

  try {
    const accommodations = await StudentAccom.findAll({
      where: { semesterId: semesterId },
      include: [
        { model: db.accommodation },
        { model: db.semester },
        { model: db.student },
      ],
    });

    if (accommodations.length > 0) {
      res.send(accommodations);
    } else {
      console.log("Sending 404");
      res.status(404).send({
        message: `Cannot find accommodations for semester with ID ${semesterId}`,
      });
    }
  } catch (err) {
    console.log("Sending 500");
    res.status(500).send({
      message:
        err.message ||
        "Error retrieving accommodations for semester with ID " + semesterId,
    });
  }
};

//update a student accom by the id in the request
exports.update = (req, res) => {
  const id = req.params.studentAccomId;
  StudentAccom.update(req.body, {
    where: { id: studentAccomId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "student accom was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update student accom with id=${id}. Maybe student accom was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating student accom with id=" + id,
      });
    });
};

// Delete a request with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.studentAccomId;
  StudentAccom.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "studentAccom was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete studentAccom with id=${id}. Maybe studentAccom was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete studentAccom with id=" + id,
      });
    });
};
