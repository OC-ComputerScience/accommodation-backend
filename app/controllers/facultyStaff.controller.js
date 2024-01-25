const db = require("../models");
const FacultyStaff = db.facultyStaff;
const Op = db.Sequelize.Op;

//create a new staff member
exports.create = (req, res) => {
    //validate request
    if(!req.body.facultyStaffId){
        res.status(400).send({
            message: "Content cannot be empty",
        });
        return;
    }
    const facultyStaff = {
        facultyStaffId: req.body.facultyStaffId,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        accomCatId: req.body.accomCatId,
        createdAt: new Date(),
        updatedAt: new Date() 
    };
    FacultyStaff.create(facultyStaff)
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred whilst creating the staff member"
        });
    });
};

//retrieve all staff
exports.findAll = (req, res) => {
    const id = req.query.facultyStaffId;
    var condition = id ? {id: {[Op.like]: `%${id}`}} : null;
    FacultyStaff.findAll({where : condition})
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving staff"
            });
        });
};

//might do a find all for accommcategory if the need arises

//find a single staff member by id
exports.findOne = (req, res) => {
    const id = req.params.facultyStaffId;
    FacultyStaff.findByPk(id)
    .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find faculty with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error retrieving faculty with id=" + id,
        });
      });
};

//update a faculty member
exports.update = (req, res) => {
    const id = req.params.facultyStaffId;
    FacultyStaff.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "faculty member was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update faculty member with id=${id}. Maybe faculty member was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error updating faculty member with id=" + id,
        });
      });
};

//delete a faculty member by an id
exports.delete = (req, res) => {
    const id = req.params. facultyStaffId;
    FacultyStaff.destroy({
        where: { id: id},
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

//delete all faculty members (only use if university shuts down)

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
