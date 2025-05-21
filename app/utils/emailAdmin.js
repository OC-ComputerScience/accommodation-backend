const db = require("../models");
const nodemailer = require("./nodeMailer.helper");
const axios = require("axios");

exports.emailCategoryTemplate = async (studentId, semesterId, accomCatIds) => {
  console.log("Begin emailCategoryTemplate method" + studentId);
  // Get the student
  let student = await db.student.findByPk(studentId);
  let semester = await db.semester.findByPk(semesterId);
  for (const accomCatId of accomCatIds) {
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
    const recipient = "d.ndayegamiye@eagles.oc.edu"; // change this email to be dynamic
    const subject = message.description;
    const messageData = {
      studentName: `${student.fName} ${student.lName}`,
      categoryName: category.name,
      semesterName: semester.semester,
    };

    let body = fillTemplate(message.text, messageData);

    // Fix line breaks
    body = body.replace(/\\n/g, "\n"); // for plain text

    // Send the email
    nodemailer.sendEmail(recipient, subject, body);
  }
};
function fillTemplate(template, data) {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] ?? "");
}
