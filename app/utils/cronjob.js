const nodemailerHelper = require("./nodeMailer.helper.js");
const db = require("../models/index.js");
const { send_non_faculty_emails } = require("./emailAdmin.js");
const { emailFaculty } = require("./email.helper.js");
const cron = require("node-cron");


exports.dailyEmail = async () => {

  cron.schedule("*/5 * * * *", async () => {
    console.log("Running task every 5 minutes");

    const requests = await db.request.findAll({
      where: {
        status: "Auto",
      },
    });

    for (const request of requests) {
      const studentId = request.studentId;
      const newSemesterId = request.semesterId;
      const accomCatIds = [];
      db.request.update(
        {
          status: "Approved",
        },
        {
          where: {
            requestId: request.requestId,
          },
        }
      )

      const studentAccommodations = await db.studentAccom.findAll({
        where: {
          studentId: studentId,
          semesterId: newSemesterId,
          status: "Approved",
        },
        include: [
          {
            model: db.accommodation,
            attributes: [
              "accomCatId",
              "title",
              "categoryName",
              "explanationFile",
            ],
          },
        ],
      });
      for (const accom of studentAccommodations) {
        accomCatIds.push(accom.accommodation.accomCatId);
      }

      send_non_faculty_emails(studentId, newSemesterId, accomCatIds);
      emailFaculty(studentId, newSemesterId);

      const filenames = [];
      for (const accom of studentAccommodations) {
        filenames.push(accom.accommodation.explanationFile);
      }
      const accommodationList = studentAccommodations.map(
        (accom) =>
          `• ${accom.accommodation.title} (${accom.accommodation.categoryName}) - ${accom.status} today\n`
      );
      // Get the email message
      const emailMessage = await db.emailMessage.findOne({
        include: [
          {
            model: db.accomCat,
            where: { name: "student_accommodation_approved" },
          },
        ],
      });
      const semester = await db.semester.findByPk(newSemesterId);
      const student = await db.student.findByPk(studentId);

      let message = emailMessage.text.replace(
        "{accommodationList}",
        accommodationList
      );
      message = message
        .replace("{semesterName}", semester.semester)
        .replace("{studentName}", student.fName);
      nodemailerHelper.logEmail(
        null,
        "student_accommodation_approved",
        studentId,
        student.email,
        message
      );

      nodemailerHelper.sendEmail(
        student.email,
        emailMessage.description + " - Automatic Approval",
        message,
        filenames
      );
    }
    // Your task code here
  });
}
