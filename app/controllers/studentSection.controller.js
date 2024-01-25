const db = require("../models");
const StudentSection = db.studentSection;
const Section = db.section;
const Student = db.student;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

    try {
        const section = await Section.findOne({
            where: {
                sectionId: req.body.sectionId
            },
        });

        const student = Student.findOne({
            where: {
                studentId: req.body.studentId,
            },
        });

        if (!student || !section){
            res.status(404).send({
                message: 'student or Section not found',
            });
            return;
        }

        const studentSection = {
                SectionId: section.SectionId,
                createdAt: new Date(),
                updatedAt: new Date(),
                studentId: student.studentId,
            };

        const createdRequest = await StudentSection.create(studentSection);

        res.send(createdRequest);
    }catch(err){
        res.status(500).send({
            message:err.message || 'some error occurred whilst creating the student Section',
        });
    }
};

//retrieve all studentSections from the database
exports.findAll = (req, res) => {
    const studentSectionId = req.query.studentSectionId;
    var condition = studentSectionId ? {studentSectionId: {[Op.like]: `%${studentSectionId}%`}} : null;
    StudentSection.findAll({ 
        include: {all: true},
        where: condition
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                err.message || "Some error occurred whilst retrieving student Sections"

            });
        });
};

//find a single request with an id
exports.findOne = (req, res) => {
    const id = req.params.studentSectionId;
    StudentSection.findByPk(studentSectionId)
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find student Section with id=${studentSectionId}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error retrieving student Section with id=" + studentSectionId,
        });
      });
 };

  //update a student Section by the id in the request
exports.update = (req, res) => {
    const id = req.params.studentSectionId;
    StudentSection.update(req.body, {
      where: { id: studentSectionId },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "student Section was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update student Section with id=${id}. Maybe student Section was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating student Section with id=" + id,
        });
      });
};

// Delete a request with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.studentSectionId;
    StudentSection.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "studentSection was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete studentSection with id=${id}. Maybe studentSection was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete studentSection with id=" + id,
        });
      });
};

// Delete all studentSections from the database.
exports.deleteAll = (req, res) => {
    StudentSection.destroy({
      where: {},
      truncate: false,
    })
      .then((nums) => {
        res.send({ message: `${nums} studentSections were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all studentSections.",
        });
      });
  };