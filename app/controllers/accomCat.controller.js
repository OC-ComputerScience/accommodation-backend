const db = require("../models");
const AccomCat = db.accomCat;
const Op = db.Sequelize.Op;

//create and save a new session
exports.create= (req, res) => {
    //create a session
    console.log(req.body.name)
    const accomCat = {
        accomCatId: req.body.id,
        name: req.body.name,
    };

    //save session in the database
    AccomCat.create(accomCat)
        .then((data) =>{
            res.send(data);
        })
        .catch((err) =>{
            res.status(500).send({
                message: 
                    err.message || "Some error occurred while creating an accomodation category"
            });
        });
};


//retrieve all accomCats from the database
exports.findAll = (req, res) => {
    const id = req.query.id;
    let condition = id ? { id: { [Op.like]: `%${id}%`}} : null;


    AccomCat.findAll({Where: condition})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error occured while retrieving sessions"
            });
        });
};

//find a single accomCat by its ID

exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log("finding one")
  AccomCat.findByPk(id)
      .then((data) => {
          if (data) {
              res.send(data);
          } else {
              res.status(404).send({
                  message: `Cannot find accomCat with id=${id}.`,
              });
          }
      })
      .catch((err) => {
          res.status(500).send({
              message: "Error retrieving accomCat with id=" + id,
          });
      });
};

exports.findByName = (req, res) => {
  
}
  
  // Delete all accomodation Categories from the database.
exports.deleteAll = (req, res) => {
  AccomCat.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} People were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};
exports.deleteById = (req, res) => {
  const accomCatId = req.params.accomCatId;

  AccomCat.destroy({
      where: { accomCatId: accomCatId },
  })
  .then((num) => {
      if (num == 1) {
          res.send({ message: `${accomCatId} Accomodation category was deleted successfully!` });
      } else {
          res.status(404).send({
              message: `Cannot delete Accomodation category with id=${accomCatId}. Maybe it was not found.`,
          });
      }
  })
  .catch((err) => {
      res.status(500).send({
          message: "Could not delete Accomodation category with id=" + accomCatId,
      });
  });
};

//update a request by the id in the request
exports.update = (req, res) => {
  const id = req.params.accomCatId;

  AccomCat.update(req.body, {
    where: { accomCatId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "accomCat was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update accomCat with accomCatId=${id}. Maybe accommodation was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating accommodation with id=" + id,
      });
    });
};