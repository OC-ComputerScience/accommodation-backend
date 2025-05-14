
const db = require("../models");
const nodemailer = require("./nodeMailer.helper");
const axios = require('axios');

exports.emailChapel = async (studentId, semesterId, accomCatId) => {
  console.log("Begin emailChapel method");
  // Get the student
  let student = await db.student.findByPk(studentId);
  // let semester = await db.semester.findByPk(semesterId);
  let accomCat = await db.accomCat.findByPk(accomCatId); // Get the accomCatId
  // let accomCat = await db.accomCat.findOne({ where: { name: 'Chapel' } });
  // Get the associated studentAccoms for the given semester
    const accommodation = await db.accommodation.findOne({
          
      accomCatId: accomCatId, // Filter by accomId
          include: [
            {
              model: db.accomCat, // Join with Category table
              as: "accomCat",
            },
          ],
        });
       
 
    if (!accomCatId) {
      return { error: "accomCatId is required" };
      
    }
    
   
    console.log("Received accomCatId:", accomCatId);

      console.log("here's the name ", accommodation.accomCat.name); 
  
      

      nodemailer.sendEmail({
        to: "diella.mwambutsa@eagles.oc.edu", // Send to the category-specific email address
        // subject: `Accommodation Approved`,
        subject: 'Accomodation Approved For Chapel',
        text: `Hello,: ${student.fName} ${student.lName} has been approved for these chapel accommodations for Spring2023. ${accommodation.accomCat.name} The attached documents describe each accommodation. Please assist the student with these accommodations. Thanks! Student Success`, // Email body content
      });
   

  console.log("Email Service Received ->", emailData); // Debugging log

   
}

