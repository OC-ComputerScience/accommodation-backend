const db = require("../models");
const nodemailer = require("./nodeMailer.helper");

exports.send_non_faculty_emails = async (studentId, semesterId, accomCatIds) => {
  // Get the student
  const student = await db.student.findByPk(studentId);
  const semester = await db.semester.findByPk(semesterId);
  for (const accomCatId of accomCatIds) {
    // Get student specific accommodations
    const studentAccommodations = await db.studentAccom.findAll({
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
    const recipient = "michael.ferguson@oc.edu"; // change this email to be dynamic
    const subject = fillTemplate(message.description, { studentName: `${student.fName} ${student.lName}` });
    const messageData = {
      studentName: `${student.fName} ${student.lName}`,
      categoryName: category.name,
      semesterName: semester.semester,
    };

    let body = fillTemplate(message.text, messageData);
    const filenames = [];

    // Fix line breaks
    body = body.replace(/\\n/g, "\n"); // for plain text
    body += `\n\nAccommodations:`;
    for (const studentAccommodation of studentAccommodations) {
      const accommodation = studentAccommodation.accommodation;
      const today = new Date();
      const updatedAt = new Date(studentAccommodation.updatedAt);

      // Set both dates to start of day for comparison
      today.setHours(0, 0, 0, 0);
      updatedAt.setHours(0, 0, 0, 0);

      if (accommodation.accomCatId === accomCatId) {
        if (today.getTime() === updatedAt.getTime())
        body += `\n-${accommodation.title} - ${studentAccommodation.status} today`;
      else 
        body += `\n-${accommodation.title} - ${studentAccommodation.status} previously`;
        if (accommodation.explanationFile && studentAccommodation.status === 'Approved') filenames.push(accommodation.explanationFile);
        nodemailer.logEmail(studentAccommodation.studentAccomId, accommodation.categoryName, studentId, recipient, body);
      }
    }

    // Send the email
    nodemailer.sendEmail(recipient, subject, body, filenames);
  }
};
function fillTemplate(template, data) {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] ?? "");
}
