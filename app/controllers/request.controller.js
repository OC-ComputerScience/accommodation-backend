const db = require("../models");
const Request = db.request;
const Semester = db.semester;
const Student = db.student;
const Op = db.Sequelize.Op;



// Create a new request and add it to the database
exports.create = async (req, res) => {
  if (!req.body.semesterId || !req.body.studentId || !req.body.email) {
      return res.status(400).json({ message: "Missing required fields: semesterId, studentId, or email!" });
  }

  try {
      // Create request object
      const request = {
          dateMade: new Date(),
          approvedBy: null,
          status: 'Open',
          semesterId: req.body.semesterId,
          studentId: req.body.studentId,
      };

      // Insert request into the database
      const createdRequest = await Request.create(request);
      
      // Only send email **after** request is successfully created
       const nodemailerHelper = require('../utils/nodeMailer.helper');
   //  const { sendAccommodationEmail } = require('../utils/nodeMailer.helper'); // change sa to option 2 dans chat

   console.log("Sending email to:", req.body.email);
   await nodemailerHelper.sendAccommodationEmail(
          req.body.email, 
          'ADA Accommodations -- Next Steps', 
          'Dear student, thank you for making a student ADA accommodations request! To continue in the process, please make an appointment with Student Success to review your situation and get you assigned accommodations for this semester. Please bring <document list> to your appointment.'
      );

      res.status(201).json(createdRequest);
  } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};


//retrieve all requests from the database
exports.findAll = (req, res) => {
  const requestId = req.query.requestId;
  var condition = requestId ? { requestId: { [Op.like]: `%${requestId}%` } } : null;
  Request.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whilst retrieving requests"

      });
    });
};

//find all requests for status of either 'Open' or 'Closed'
exports.findAllForStatus = (req, res) => {
  const status = req.params.status
  Request.findAll({ where: { status: status }, include: [{model: db.student}, {model:db.semester}]})
    .then((data) => {
      if (data) {
        res.send(data);
      }
      else {
        res.status(404).send({
          message: `Cannot find ${status} requests.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message ||
          'Error retrieving ' + status + ' requests.',
      });
    });
};

exports.findAllForStudent = (req, res) => {
    const studentId = req.params.studentId
    Request.findAll({where: {studentId: studentId}, include: [{model: db.student}, {model:db.semester}]})
        .then((data) => {
            if(data){
                res.send(data);
            }
            else{
                res.status(404).send({
                    message: `Cannot find ${student}'s requests.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Error retrieving " + student + "'s requests.",
            });
        });
};

//find a single request with an id
exports.findOne = (req, res) => {
  const id = req.params.requestId;
  Request.findByPk(id, { include: [db.student, db.semester] })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Request with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Request with id=" + id,
      });
    });
};

//update a request by the id in the request
exports.update = (req, res) => {
  console.log(req.body);
  const id = req.params.id;

  Request.update(req.body, {
    where: { requestId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "request was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update request with id=${id}. Maybe request was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating request with id=" + id,
      });
    });
};

// Delete a request with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.requestId;
  Request.destroy({
    where: { requestId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "request was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete request with id=${id}. Maybe request was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete request with id=" + id,
      });
    });
};

