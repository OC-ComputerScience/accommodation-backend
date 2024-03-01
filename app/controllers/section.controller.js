const db = require("../models");
const Section = db.section;
const Op = db.Sequelize.Op;

//create a new Section and add to the database
exports.create = (req, res) => {
    if(!req.body.sectionId){
        res.status(400).send({
            message: "Content cannot be empty"
        });
        return;
    }
    const section = {
        sectionId: req.body.sectionId,
        semester: req.body.semester,
        courseNumber: req.body.courseNumber,
    };
    Section.create(section)
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred whilst creating the section"
        });
    });
}

//retrieve all sections from the database
exports.findAll = (req, res) => {
    const id = req.query.sectionId;
    var condition = accomId ? {id: {[Op.like]: `%${id}%`}} : null;
    Accommodation.findAll({ where: condition})
        .then((data) => {
          console.log(data.length);
          if (data && data.length > 0) {
            console.log('here', data)
            res.status(200).send(data);
        } else {
            res.status(404).send({ message: "No sections found" });
        }
        })
        .catch((err) => {
          console.log(err);
            res.status(500).send({
                message:
                err.message || "Some error occurred whilst retrieving section"

            });
        });
};

//find a single section with an id
exports.findOne = (req, res) => {
    const id = req.params.sectionId;
    Section.findByPk(id)
    .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Accommodation with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error retrieving section with id=" + id,
        });
      });
};

//update a section by the id

exports.update = (req, res) => {
    const id = req.params.sectionId;
    Section.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "sectoin was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update section with id=${id}. Maybe accommodation was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating section with id=" + id,
        });
      });
};

//delete a section with id
exports.delete = (req, res) => {
    const id = req.params.sectionId;
    Section.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "section was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete section with id=${id}. Maybe request was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete section with id=" + id,
        });
      });
};

