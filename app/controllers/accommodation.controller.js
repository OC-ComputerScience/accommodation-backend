const db = require("../models");
const Accommodation = db.accommodation;
const Op = db.Sequelize.Op;

//create a new accommodation and add it to the database
exports.create = (req, res) => {
    const accommodation = {
        accomId: req.body.accomId,
        categoryName: req.body.categoryName,
        title: req.body.title,
        description: req.body.description,
        explanationFile: req.body.explanationFile,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
        Accommodation.create(accommodation)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred whilst creating the accommodation"
            });
        });
};

//retrieve all accommodations from the database
exports.findAll = (req, res) => {
    const accomId = req.query.accomId;
    var condition = accomId ? {accomId: {[Op.like]: `%${accomId}%`}} : null;
    Accommodation.findAll({ where: condition})
        .then((data) => {
          console.log(data.length);
          if (data && data.length > 0) {
            console.log('here', data)
            res.status(200).send(data);
        } else {
            res.status(404).send({ message: "No accommodations found" });
        }
        })
        .catch((err) => {
          console.log(err);
            res.status(500).send({
                message:
                err.message || "Some error occurred whilst retrieving accommodation"

            });
        });
};

exports.findAllForAccommCategory = (req, res) => {
    const accomcats = req.params.accomCatId
    Accommodation.findAll({where: {accomcats: accomcats}})
        .then((data) => {
            if(data){
                res.send(data);
            }
            else{
                res.status(404).send({
                    message: `Cannot find ${accomcats}'s requests.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Error retrieving " + accomcats + "'s requests.",
            });
        });
};

//find a single request with an id
exports.findOne = (req, res) => {
    const id = req.params.accomId;
    Accommodation.findByPk(id)
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
          message: err.message || "Error retrieving Accommodation with id=" + id,
        });
      });
 };
 
 //update a request by the id in the request
 exports.update = (req, res) => {
    const id = req.params.id;
    Accommodation.update(req.body, {
      where: { accomId: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "accommodatiom was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update accomodation with id=${id}. Maybe accommodation was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating accommodation with id=" + id,
        });
      });
};

// Delete an accommodation with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Accommodation.destroy({
      where: { accomId: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "accommodation was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete accommodation with id=${id}. Maybe request was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete accommodation with id=" + id,
        });
      });
};

// Delete all accommodations from the database.
exports.deleteAll = (req, res) => {
    Accommodation.destroy({
      where: {},
      truncate: false,
    })
      .then((nums) => {
        res.send({ message: `${nums} Requests were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all accommodations.",
        });
      });
  };