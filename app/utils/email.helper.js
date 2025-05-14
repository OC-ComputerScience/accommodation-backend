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
   // console.log("looking for the id", studentId);
     console.log("looking for the semester", semester.semester); 
     console.log("Student ID (auto-incremented):", student.studentId);
    console.log("JL Student ID (school ID):", student.ocStudentId);


    let courses = [];
    let ocRequest = 'http://stingray.oc.edu/api/accommodationuserschedule/'+ '1564648' + '/' + semester.semester;
    console.log("Requesting:", ocRequest);

     await axios.get(ocRequest)
        .then(function (response) {
            if (response.data.Success === "False") {
                throw new Error("API request failed: " + response.data.Message);
            }
            console.log("Raw API Response:", JSON.stringify(response.data, null, 2)); //ici

        // handle success
        courses = response.data.Courses;
        console.log(courses);
        })
        .catch(function (error) {
            console.error("API Error:", error.response ? error.response.data : error.message);

            console.log("error retrieving person's classes", error); 
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
    console.log("🚀 outside the for loop");


        for (const course of courses) {
            // Build body string
            console.log("🚀 third for loop");

            let body = `Dear `
            {
                for (instructor of course.Instructors) {
                    body += `${instructor.Name},\n\n`
                    body += `This email is to inform you that ${student.fName} ${student.lName} in ${course.CourseName} has the following Academic Accommodations:\n\n`
                    console.log("length" + studentAccoms.length);
                    for (const studAccom of studentAccoms) {
                    
                        body += `${studAccom.dataValues.accommodation.title}\n\n`
                        
                        //console.log("this is it girl:",studAccom.dataValues.accommodation.title)
                    }
                }
                console.log(" idk if it will get here but let's see ");

                body += `Please contact Student Success with any questions.`
                // Send email            
                nodemailer.sendEmail("diella.mwambutsa@eagles.oc.edu", "Notice of Student Accommodations", body);
                // TODO: Insert into emailLog
            }

        }
    }










