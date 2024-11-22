const db = require("../models");
const nodemailer = require("./nodeMailer.helper");
const axios = require('axios'); 


// Emails all faculty who have the given student for a class in the given semester.
// Includes all Academic Student Accommodations in the email.
exports.emailFaculty = async (studentId, semesterId) => {
    console.log("Begin emailFacStaff method");
    // Get the student
    let student = await db.student.findByPk(studentId);
    let semester = await db.semester.findByPk(semesterId);
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
console.log ("get student Classes");
    // Get the student's faculty
    let courses = [];
    let ocRequest = 'http://stingray.oc.edu/api/accommodationuserschedule/'+ student.ocStudentId + '/' + semester.semester;
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
console.log ("got student Classes");
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

