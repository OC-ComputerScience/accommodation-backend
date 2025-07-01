const db = require("../models");
const Request = db.request;
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

    const semester = await db.semester.findByPk(req.body.semesterId);
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    // Insert request into the database
    const createdRequest = await Request.create(request);

    // Only send email **after** request is successfully created
     const nodemailerHelper = require('../utils/nodeMailer.helper');

    // get email information
    const emailMessage = await db.emailMessage.findOne({
      include: [
        {
          model: db.accomCat,
          where: { name: "student_accommodation_request_received" },
        },
      ],
    });

    nodemailerHelper.logEmail(
      null,
      "student_accommodation_request_received",
      req.body.studentId,
      req.body.email,
      emailMessage.text.replace('{semesterName}', semester.semester)

    );


    console.log("Sending email to:", req.body.email);
    nodemailerHelper.sendEmail(
      req.body.email,
      emailMessage.description,
      emailMessage.text.replace('{semesterName}', semester.semester)

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
          message: `Cannot find ${studentId}'s requests.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
              message:
                err.message ||
                "Error retrieving " + studentId + "'s requests.",
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
exports.update = async (req, res) => {
  const id = req.params.id;

  const request = await Request.findByPk(id, {
    include: [{ model: db.student }],
  });

  const { studentId, semesterId } = request;

  // 2. Get StudentAccoms with accommodations included
  const studentAccoms = await db.studentAccom.findAll({
    where: {
      studentId,
      semesterId,
    },
    include: [
      {
        model: db.accommodation,
        attributes: ["title", "categoryName", "explanationFile"],
      },
    ],
  });
  const filenames = [];

  const formattedList = studentAccoms
    .map((sa) => {
      const accom = sa.accommodation;
      const today = new Date().toDateString();
      const updatedDate = new Date(sa.updatedAt).toDateString();
      if(accom?.title && accom?.categoryName)
      {
        if(sa.status == "Approved" && accom.explanationFile) filenames.push(accom.explanationFile);
        if( today === updatedDate)
        return `• ${accom.title} (${accom.categoryName}) - ${sa.status} today`;
        else
        return `• ${accom.title} (${accom.categoryName}) - ${sa.status} previously`;
      }
      else return null;
    })
    .filter(Boolean)
    .join("\n");

    // Get the email message
    const emailMessage = await db.emailMessage.findOne({
      include: [
        {
          model: db.accomCat,
          where: { name: "student_accommodation_approved" },
        },
      ],
    });
    const semester = await db.semester.findByPk(semesterId);


  let message = emailMessage.text.replace('{accommodationList}', formattedList);
  message = message.replace('{semesterName}', semester.semester);

  Request.update(req.body, {
    where: { requestId: id },
  })
    .then(async (num) => {
      if (num == 1) {
        if(req.body.approvedBy == null || formattedList.length == 0) {
          message = " Your accommodation request for the " + semester.semester + " has been denied! \n\n";
        }
        // Only send email **after** request is successfully created
        const nodemailerHelper = require("../utils/nodeMailer.helper");
        nodemailerHelper.logEmail(
          null,
          "student_accommodation_approved",
          studentId,
          request.student.email,
          message
        );

        nodemailerHelper.sendEmail(
          request.student.email,
          emailMessage.description,
          message,
          filenames
        );

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

