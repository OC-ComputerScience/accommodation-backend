const db = require("../models");
const nodemailer = require("./nodeMailer.helper");
const axios = require("axios");

exports.emailCategoryTemplate = async (studentId, semesterId, accomCatIds) => {
  // Get the student
  let student = await db.student.findByPk(studentId);
  let semester = await db.semester.findByPk(semesterId);
  for (const accomCatId of accomCatIds) {
    // Get student specific accommodations
    let studentAccoms = await db.studentAccom.findAll({
      where: {
        studentId: studentId,
        semesterId: semesterId,
      },
      include: {
        model: db.accommodation,
        required: true,
      },
    });

    // Get the email message
    const message = await db.emailMessage.findOne({
      where: { accomCatId },
    });

    // Get the email recipient from accomcats
    const category = await db.accomCat.findOne({
      where: { accomCatId },
    });

    // If either is missing, skip
    if (!message || !category) {
      console.warn(`Missing message or category for accomCatId ${accomCatId}`);
      continue;
    }

    // Prepare email details
    const recipient = "david.north@oc.edu"; // change this email to be dynamic
    const subject = message.description;
    const messageData = {
      studentName: `${student.fName} ${student.lName}`,
      categoryName: category.name,
      semesterName: semester.semester,
    };

    let body = fillTemplate(message.text, messageData);
    let filenames = [];

    // Fix line breaks
    body = body.replace(/\\n/g, "\n"); // for plain text
    body += `\n\naccommodation:`;
    for (const sa of studentAccoms) {
      const accom = sa.accommodation;
      if (accom.accomCatId === accomCatId) {
        body += `\n\n${accom.title}`;
        filenames.push(accom.explanationFile);
      }
    }

    // Send the email
    nodemailer.sendEmail(recipient, subject, body, filenames);
  }
};
function fillTemplate(template, data) {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] ?? "");
}
