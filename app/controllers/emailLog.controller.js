const db = require("../models");
const EmailLog = db.emailLog;
const Student = db.student;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if(!req.body.toEmailAddress){
        return res.status(400).send({
            message: "Email address is required",
        });
    }

    const emailLog = {
        toEmailAddress: req.body.toEmailAddress,
        date: new Date(),
        category: req.body.category || 'General',
        studentId: req.body.studentId,
        senderEmail: req.body.senderEmail || 'system@oc.edu',
        messageContent: req.body.messageContent
    };

    EmailLog.create(emailLog)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creating email log"
            });
        });
};

exports.findAll = (req, res) => {
  console.log("Backend: findAll called");
  const id = req.query.emailLogId;
  var condition = id ? {emailLogId: {[Op.like]: `%${id}%`}} : null;
  
  EmailLog.findAll({
      where: condition,
      include: [{
          model: db.studentAccom,
          as: 'studentAccom',
          include: [{
              model: Student,
              as: 'student'
          }]
      }],
      logging: console.log // This will log the actual SQL query
  })
  .then((data) => {
      console.log("Backend: Found data:", JSON.stringify(data, null, 2));
      res.send(data);
  })
  .catch((err) => {
      console.log("Backend Error:", err);
      res.status(500).send({
          message: err.message
      });
  });
};

exports.findOne = (req, res) => {
    const id = req.params.emailLogId;
    
    EmailLog.findByPk(id, {
        include: [{
            model: Student,
            as: 'student',
            attributes: ['studentId', 'fName', 'lName', 'email']
        }]
    })
    .then(data => {
        if(data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Email log ${id} not found`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error retrieving email log ${id}`
        });
    });
};

exports.update = (req, res) => {
    const id = req.params.emailLogId;
    
    // Remove fields that shouldn't be updated
    delete req.body.emailLogId;
    delete req.body.date;

    EmailLog.update(req.body, {
        where: { emailLogId: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({ message: "Email log updated successfully" });
        } else {
            res.status(404).send({
                message: `Email log ${id} not found`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error updating email log ${id}`
        });
    });
};
//changes
// Delete remains the same
exports.delete = (req, res) => {
    const id = req.params.emailLogId;
    
    EmailLog.destroy({
        where: { emailLogId: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({ message: "Email log deleted successfully" });
        } else {
            res.status(404).send({
                message: `Email log ${id} not found`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error deleting email log ${id}`
        });
    });
};