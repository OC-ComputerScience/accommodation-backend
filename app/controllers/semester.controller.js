const db = require("../models");
const Semester = db.semester;
const Op = db.Sequelize.Op;

//create
exports.create = (req, res) =>{
    if(!req.body.semester || !req.body.startDate || !req.body.endDate){
        res.status(400).send({
            message: "Content cannot be empty",
        });
        return;
    }
    const semester = {
        semester: req.body.semester,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    };
    Semester.create(semester)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred whilst creating the semester'
            });
        });
};

//find all
exports.findAll = (req, res) => {
    Semester.findAll({order : [['startDate', 'DESC']]})
        .then((data) => {
            if(data.length > 0)
              res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                err.message || "Some error occurred whilst retrieving semesters"

            });
        });
};

//find one by ID
exports.findOne = (req, res) => {
    const id = req.params.semesterId;
    Semester.findByPk(id)
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find semester with id=${semesterId}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error retrieving semester with id=" + semesterId,
        });
      });
 };

//find one by season + year
exports.findOneForSemester = (req, res) => {
    const semester = req.params.semester;
    const year = req.params.year;
    Semester.findAll({where: {semester: semester}})
        .then((data) => {
            if(data){
                res.send(data);
            }
            else{
                res.status(404).send({
                    message: `cannot find ${season} ${year}`,
                });
            } 
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Error retrieving '+season+' '+year,
            });
        });
};

//update
exports.update = (req, res) => {
    const id = req.params.semesterId;
    Semester.update(req.body, {
      where: { semesterId: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "semester was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update semester with id=${id}. Maybe semester was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating semester with id=" + id,
        });
      });
};

//delete
exports.delete = (req, res) => {
    const id = req.params.semesterId;
    Semester.destroy({
      where: { semesterId: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "semester was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete semester with id=${id}. Maybe semester was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete semester with id=" + id,
        });
      });
};