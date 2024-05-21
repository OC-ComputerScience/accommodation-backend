const db = require("../models");
const FacultySection = db.facultySection;
const Op = db.Sequelize.Op;

//create a new faculty section
exports.create = (req, res) => {
    if(!req.body.facultySectionId){
        res.status(400).send({
            message: "Content cannot be empty",
        });
        return;
    }
    const facultySection = {
        facultySectionId: req.body.facultySectionId,
        facultyId: req.body.facultyId,
        sectionId: req.body.sectionId,
    };

    FacultySection.create(facultySection)
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred whilst creating the faculty section"
        });
    });
};

//retrieve all facultysections from the DB
exports.findAll = (req, res) => {
    const id = req.query.facultySectionId;
    var condition = id ? {id: {[Op.like]: `%${id}%`}} : null;
    FacultySection.findAll({ where: condition})
        .then((data) => {
          console.log(data);
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                err.message || "Some error occurred whilst retrieving faculty section"
            });
        });
};

//find a single faculty section by ID
exports.findOne = (req, res) => {
    const id = req.params.facultySectionId;
    FacultySection.findByPk(id)
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find faculty section with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error retrieving faculty section with id=" + id,
        });
      });
 };

 //update a faculty section by id

 exports.update = (req, res) => {
    const id = req.params.facultySectionId;
    FacultySection.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "faculty section was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update faculty section with id=${id}. Maybe faculty section was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating faculty section with id=" + id,
        });
      });
};

//delete a faculty section by an ID
exports.delete = (req, res) => {
    const id = req.params.facultySectionId;
    FacultySection.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "faculty section was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete faculty section with id=${id}. Maybe request was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete faculty section with id=" + id,
        });
      });
};

