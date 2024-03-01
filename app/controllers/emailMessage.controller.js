const db = require("../models");
const EmailMessage = db.emailMessage;
const Op = db.Sequelize.Op;

// Create and save a new email message
exports.create = (req, res) => {
    // Create an email message
    const emailMessage = {
        name: req.body.name,
        description: req.body.description,
        text: req.body.text,
    };

    // Save email message in the database
    EmailMessage.create(emailMessage)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating an email message."
            });
        });
};

// Update an email message by ID
exports.update = (req, res) => {
    const id = req.params.id;

    EmailMessage.update(req.body, {
        where: { emailMessageId: id }
    })
        .then((result) => {
            if (result[0] === 1) {
                res.send({ message: "Email message was updated successfully." });
            } else {
                res.status(404).send({
                    message: `Cannot update email message with id=${id}. Email message not found or request body is empty.`
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating email message with id=" + id
            });
        });
};

// Retrieve all email messages from the database
exports.findAll = (req, res) => {
    const id = req.query.id;
    let condition = id ? { emailMessageId: { [Op.like]: `%${id}%` } } : null;

    EmailMessage.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving email messages."
            });
        });
};

// Find a single email message by its ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    EmailMessage.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find email message with id=${id}.`
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving email message with id=" + id
            });
        });
};

