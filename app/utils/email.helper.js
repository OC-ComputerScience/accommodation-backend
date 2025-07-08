const db = require("../models");
const nodemailer = require("./nodeMailer.helper");
const axios = require("axios");

// Emails all faculty who have the given student for a class in the given semester.
// Includes all Academic Student Accommodations in the email.
exports.emailFaculty = async (studentId, semesterId) => {
  // Get the student
  const student = await db.student.findByPk(studentId);
  const semester = await db.semester.findByPk(semesterId);

  const studentAccommodations = await db.studentAccom.findAll({
    where: {
      studentId: studentId,
      semesterId: semesterId,
    },
    include: {
      model: db.accommodation,
      required: true,
      include: {
        model: db.accomCat,
        where: { name: "Academics" },
        required: true,
      },
    },
  });
  console.log("get student Classes");
  // Get the student's faculty
  console.log("looking for the semester", semester.semester);
  console.log("Student ID (auto-incremented):", student.studentId);
  console.log("JL Student ID (school ID):", student.ocStudentId);

  let courses = [];
  // getting student classes for Daniel's ID
  const ocRequest =
    "http://stingray.oc.edu/api/accommodationuserschedule/" +
    "1568650" +
    "/" +
    semester.semester;

  await axios
    .get(ocRequest)
    .then(function (response) {
      if (response.data.Success === "False") {
        throw new Error("API request failed: " + response.data.Message);
      }
      // handle success
      courses = response.data.Courses;
    })
    .catch(function (error) {
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message
      );

      console.log("error retrieving person's classes", error);
      // res.status(500).send({
      //   message: "Error retrieving Person classes with student ID=" + studentId,
      // });
      console.log(error);
    });
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

  // Step 1: Map instructors to their courses
  const instructorMap = new Map();

  for (const course of courses) {
    for (const instructor of course.Instructors) {
      if (!instructorMap.has(instructor.Email)) {
        instructorMap.set(instructor.Email, {
          name: instructor.Name,
          courses: [],
        });
      }
      instructorMap.get(instructor.Email).courses.push(course);
    }
  }
  let filenames = [];

  // Step 2: Send one email per instructor
  for (const [email, instructorInfo] of instructorMap.entries()) {
    let body = `Dear ${instructorInfo.name},\n\n`;
    body += `***. Confidential Information ***\nThis information should not be given to or discussed with anyone other than the Student, Student Life, Residential Life or the Office of Accessibility without the consent of the student.\n\n`
    body += `This email is to inform you of an update regarding the accommodations for ${student.fName} ${student.lName} for the following courses for ${semester.semester}:\n\n`;

    for (const course of instructorInfo.courses) {
      body += `${course.CourseID} ${course.CourseName}\n`;
    }
    body += "Accommodations:\n";
    for (const studentAccommodation of studentAccommodations) {
      const today = new Date();
      const updatedAt = new Date(studentAccommodation.dataValues.updatedAt);

      // Set both dates to start of day for comparison
      today.setHours(0, 0, 0, 0);
      updatedAt.setHours(0, 0, 0, 0);

      if (today.getTime() === updatedAt.getTime()) {
        // less than a second difference that means it is a new entry.
        body += `- ${studentAccommodation.dataValues.accommodation.title} (${studentAccommodation.dataValues.status} today)\n`;
      } else {
        body += `- ${studentAccommodation.dataValues.accommodation.title} (${studentAccommodation.dataValues.status} previously)\n`;

      }

      if (studentAccommodation.dataValues.accommodation.explanationFile && studentAccommodation.dataValues.status === "Approved") {
        filenames.push(
          studentAccommodation.dataValues.accommodation.explanationFile
        );
      }
      nodemailer.logEmail(
        studentAccommodation.dataValues.studentAccomId,
        "Academics",
        studentId,
        email,
        body
      );
    }
    body += "\n";

    body += `Thank you for your assistance. If you have any questions, please contact me at ext. 5922.\n\nMichael Ferguson\nAssistant Director of Student Success & Accessibility Resources`;


    // Send email
      nodemailer.sendEmail(
        "d.ndayegamiye@eagles.oc.edu", // change line to send to actual instructor email
        "Notice of Student Accommodations",
        body,
        filenames
      );

  }
};
