const db = require("../models");
const nodemailer = require("./nodeMailer.helper");

// Emails all faculty who have the given student for a class in the given semester.
// Includes all Academic Student Accommodations in the email.
exports.emailFaculty = async (studentId, semesterId) => {
    console.log("Begin emailFacStaff method");
    // Get the student
    let student = await db.student.findByPk(studentId);
    // Get the associated studentAccoms for the given semester
    let studentAccoms = await db.studentAccom.findAll({
        where: {
            studentId: studentId,
            semesterId: semesterId,
        },
        include: {
            model: db.accommodation,
            required: true,
            include: {
                model: db.accomCat,
                where: { name: 'Academics' },
                required: true
            }
        }
    });

    // Get the student's faculty
    let faculty = await db.facultyStaff.findAll({
        include: {
            model: db.facultySection,
            required: true,
            include: {
                model: db.section,
                where: { semesterId: semesterId },
                required: true,
                include: {
                    model: db.studentSection,
                    required: true,
                    include: {
                        model: db.student,
                        where: { studentId: studentId },
                        required: true
                    }
                }
            }
        }
    });

    // Map the faculty array to eliminate excess data
    faculty = faculty.map(item => {
        let obj = item.dataValues;
        return {
            fName: obj.fName,
            lName: obj.lName,
            email: obj.email
        }
    });
    
    // Iterate over all the Faculty/Staff and compose/send email
    for (fac of faculty) {
        // Build body string
        let body = `${ fac.fName } ${fac.lName},\n\nBe advised that your student, ${student.dataValues.fName} ${student.dataValues.lName}, is eligible for the following academic accommodations this semester:\n\n`;
        for (studAccom of studentAccoms) {
            body += `${studAccom.dataValues.accommodation.title}\n\n`
        }
        body += `Please contact Student Success with any questions.`
        // Send email
        nodemailer.sendEmail(fac.email, "Notice of Student ADA Accommodations", body);
        // TODO: Insert into emailLog
    }

}

