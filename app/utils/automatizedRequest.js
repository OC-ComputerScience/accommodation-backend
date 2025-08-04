const db = require("../models");
const Op = db.Sequelize.Op;

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
    const oneYearLater = new Date(request.dateApproved);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const today = new Date();
    if (today <= oneYearLater) {
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
      }
    }
  } catch (err) {
    console.log(err);
  }
};
