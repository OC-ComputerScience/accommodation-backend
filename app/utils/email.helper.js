const db = require("../models");
const nodemailer = require("./nodeMailer.helper");
const axios = require('axios');


// Emails all faculty who have the given student for a class in the given semester.
// Includes all Academic Student Accommodations in the email.

// Function that will email all staff.
exports.emailStaff = async (studentId, semesterId) => {
    console.log(`Begin method to email Faculty and NonFaculty Staffs. studentId: ${studentId}, semesterId: ${semesterId}`);
    // Get the student
    let student = await db.student.findByPk(studentId);
    let semester = await db.semester.findByPk(semesterId);
    // await this.emailFaculty(student, semester); This will be implemanted later.
    await this.emailNonFaculty(student, semester);
}

exports.emailFaculty = async (student, semester) => {
    console.log("Begin emailFacStaff method");
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
    console.log("get student Classes");
    // Get the student's faculty
    let courses = [];
    let ocRequest = 'http://stingray.oc.edu/api/accommodationuserschedule/' + student.ocStudentId + '/' + semester.semester;
    console.log(ocRequest);
    await axios.get(ocRequest)
        .then(function (response) {
            // handle success
            courses = response.data.Courses;
            console.log(courses);
        })
        .catch(function (error) {
            res.status(500).send({
                message: "Error retrieving Person classes with student ID=" + studentId,
            });
            console.log(error);
        })
    console.log("got student Classes");
    // Map the faculty array to eliminate excess data
    // {"Success":"True",
    //     "UserID":"1426210",
    //     "FirstName":"Peyton",
    //     "LastName":"Chenault",
    //     "Email":"peyton.chenault@oc.edu",
    //     "Courses":[
    //         {"CourseName":"Symposium VII","CourseID":"HONR-4111-01","Instructors":[{"Name":"Dr. Jim Baird","Email":"jim.baird@oc.edu"}]},
    //         {"CourseName":"Electromagnetic Fields","CourseID":"ELEC-3613-01","Instructors":[{"Name":"Dr. Jeff Bigelow","Email":"jeff.bigelow@oc.edu"}]},
    //         {"CourseName":"The Bible \u0026 Classical Lit","CourseID":"HONR-1214-01","Instructors":[{"Name":"Dr Alden Bass","Email":"alden.bass@oc.edu"}]},
    //         {"CourseName":"Senior Engineering Seminar","CourseID":"ENGR-4701-01","Instructors":[{"Name":"Dr. Jeff Bigelow","Email":"jeff.bigelow@oc.edu"},{"Name":"Mr. Steve Maher","Email":"steve.maher@oc.edu"},{"Name":"Mr. Ken Bell","Email":"ken.bell@eagles.oc.edu"},{"Name":"Dr. David Waldo","Email":"david.waldo@oc.edu"}]},
    //         {"CourseName":"Systems Design II","CourseID":"ELEC-4743-01","Instructors":[{"Name":"Mr. Steve Maher","Email":"steve.maher@oc.edu"},{"Name":"Mr. Ken Bell","Email":"ken.bell@eagles.oc.edu"},{"Name":"Dr. David Waldo","Email":"david.waldo@oc.edu"}]},
    //         {"CourseName":"Software and Network Engineeri","CourseID":"CENG-4113-01","Instructors":[{"Name":"Mr. Matt Batchelder","Email":"matt.batchelder@oc.edu"}]},
    //         {"CourseName":"Soft Eng of Real-Time Systems","CourseID":"ELEC-4523-01","Instructors":[{"Name":"Dr. David Waldo","Email":"david.waldo@oc.edu"}]}]}


    // Iterate over all the Courses and compose/send email
    for (course of courses) {
        // Build body string
        {
            for (instructor of course.Instructors) {
                let body = `Dear ${instructor.Name},\n\n`
                body += `This email is to inform you that ${student.firstName} ${student.lastName} in ${course.CourseName} has the following Academic Accommodations:\n\n`
                for (studAccom of studentAccoms) {

                    body += `${studAccom.dataValues.accommodation.title}\n\n`
                }
            }
            body += `Please contact Student Success with any questions.`
            // Send email
            nodemailer.sendEmail(instructor.email, "Notice of Student Accommodations", body);
            // TODO: Insert into emailLog
        }

    }

}

exports.emailNonFaculty = async (student, semester) => {
    console.log("Begin emailNonFacStaff method");
    // Get the associated studentAccoms for the given semester
    let studentAccoms = await db.studentAccom.findAll({
        where: {
            studentId: student.studentId,
            semesterId: semester.semesterId,
        },
        include: {
            model: db.accommodation,
            required: true,
            include: {
                model: db.accomCat,
                where: { name: { [db.Sequelize.Op.ne]: 'Academics' } },
                required: true
            }
        }
    });

    let body; // this will be used to compose the email content. It should include the content defined in emailMessages
    console.log(`Student: ${student.fName} ${student.lName}. Semester: ${semester.semester}`);

    // We will create a map to store category (key) and list of accommodations (value)
    // category will be a tuple containing the category name and the email address
    const accomMap = {};
    studentAccoms.forEach(accom => {
        const category = `${accom.accommodation.accomCat.name}|${accom.accommodation.accomCat.email}`; // Key
        const title = accom.accommodation.title; // Value

        if (!accomMap[category]) {
            accomMap[category] = []; // Initialize with an empty list if not present
        }
        accomMap[category].push(title); // Append the title
    });

    // Iterate over the hashmap and compose a message
    for (const key in accomMap) {
        const [category, email] = key.split('|'); // Split the key back into name and email
        const titles = accomMap[key]; // Get all titles for this category

        body = `Student ${student.fName} ${student.lName} needs the following accommodations for the semester: ${semester.semester} for ${category}.\nAccommodations:\n- ${titles.join('\n- ')}`;
        console.log(body)
        // Send email
        // nodemailer.sendEmail(email, "Email Title", body);
        // TODO: Insert into emailLog and use emailMessage to compose email
    }
}