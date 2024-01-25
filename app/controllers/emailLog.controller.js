const db = require("../models");
const EmailLog = db.emailLog;
const Op = db.Sequelize.Op;

//create a new EmailLog

exports.create = (req, res) => {
    //validate request
    if(!req.body.emailLogId){
        res.status(400).send({
            message: "content cannot be empty",
        });
        return;
    }

    //create the email log

    const emailLog = {
        emailLogId: req.body.emailLogId,
        studAccId: req.body.studAccId,
        date: new Date(),
        receipt: req.body.receipt
    };
    EmailLog.create(emailLog)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred whilst creating the emailLog"
            });
        });
};

//retrieve all of the email logs from the DB
exports.findAll = (req, res) => {
    const id = req.query.emailLogId;
    var condition = id ? {id: {[Op.like]: `%${id}%`}} : null;
    Accommodation.findAll({ where: condition})
        .then((data) => {
          console.log(data);
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                err.message || "Some error occurred whilst retrieving email Logs"

            });
        });
};

//retrieve a single email log by emailLogId

exports.findOne = (req, res) =>{
    const id = req.params.emailLogId;
    EmailLog.findByPk(id)
        .then((data) => {
            if(data){
                res.send(data);
            } else {
                res.status(400).send({
                    message: `Cannot find email log with id = ${id}`,
                });
            }

        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving email log with id = " + id,
            });
        });
};

//update an email log by an id
exports.update = (req, res) =>{
    const id = req.params.emailLogId;
    EmailLog.update(req.body, {
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "Email log was updated successfully.",
            });
          } else {
            res.send({
              message: `Cannot update email log with id=${id}. Maybe email log was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error updating email log with id=" + id,
          });
        });
};

//Do a hillary clinton 
exports.delete = (req, res) => {
    const id = req.params.emailLogId;
    EmailLog.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Email Log was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete email Log with id=${id}. Maybe request was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete email log with id=" + id,
        });
      });
};

//Really do a Hillary Clinton
exports.deleteAll = (req, res) => {
    EmailLog.destroy({
      where: {},
      truncate: false,
    })
      .then((nums) => {
        res.send({ message: `${nums} Email Logs were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all email logs.",
        });
      });
  };
