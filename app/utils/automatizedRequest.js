const db = require("../models");
const { emailFaculty } = require("./email.helper");
const { send_non_faculty_emails } = require("./emailAdmin");
const Op = db.Sequelize.Op;
const nodemailerHelper = require("./nodeMailer.helper");

exports.checkAutoRequests = async (studentId, newSemesterId) => {
  try {
    const request = await db.request.findOne({
      where: {
        status: "Approved",
        studentId: studentId,
        type: "manual",
        dateApproved: { [Op.ne]: null },
      },
      order: [["dateApproved", "DESC"]],
    });
    console.log("Request: ", request);
    const oneYearLater = new Date(request.dateApproved);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const today = new Date();
    if (today <= oneYearLater) {
      console.log(
        "There is an approved request that is still valid. No new request will be sent."
      );
      latestSemesterId = request.semesterId;
      const studentAccommodations = await db.studentAccom.findAll({
        where: {
          studentId: studentId,
          semesterId: latestSemesterId,
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

      if (studentAccommodations.length != 0) {
        const accomCatIds = [
          ...new Set(
            studentAccommodations
              .map((studentAccom) => studentAccom.accommodation.accomCatId)
              .filter((id) => id !== null && id !== undefined)
          ),
        ];

        const newAccommodations = studentAccommodations.map((accom) => {
          const { studentAccomId, createdAt, updatedAt, ...data } =
            accom.toJSON(); // remove unwanted fields
          return {
            ...data,
            semesterId: newSemesterId,
          };
        });

        await db.studentAccom.bulkCreate(newAccommodations);
        // Step 1: Find the latest matching request
        const latestRequest = await db.request.findOne({
          where: {
            studentId: studentId,
            semesterId: newSemesterId,
          },
          order: [["dateMade", "DESC"]], // or use 'updatedAt' if more appropriate
        });

        // Step 2: Update only that record
        if (latestRequest) {
          await latestRequest.update({
            status: "Auto",
            dateApproved: new Date(),
            approvedBy: request.approvedBy,
            type: "auto",
          });
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
        
        
          let message = emailMessage.text.replace('{accommodationList}', accommodationList);
          message = message.replace('{semesterName}', semester.semester).replace('{studentName}', student.fName);
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
    }
  } catch (err) {
    console.log(err);
  }
};
