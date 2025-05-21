// Controller function to send category-based emails
const db = require("../models"); // Adjust the path based on your project structure
const emailService = require("../utils/emailAdmin");

exports.sendCategoryEmail = async (req, res) => {
  const { accomCatId, studentId, semesterId } = req.body; // Extract data from request body
  console.log("Received accomCatId:", accomCatId);

  try {
    // Find the accommodation by accomId and include the related category & email message
    if (!accomCatId) {
      return res.status(400).json({ error: "accomCatId is required" });
    }
    const accommodation = await db.accommodation.findOne({
      where: { accomCatId }, // Filter by accomId
      include: [
        {
          model: db.accomCat, // Join with Category table
          as: "accomCat",
          include: [
            { model: db.emailMessage, as: "emailMessages" }, // Also join with EmailSection table
          ],
        },
      ],
    });
    if (!accomCatId) {
      return res.status(400).json({ error: "accomCatId is required" });
    }

    // If accommodation or category is not found, return an error
    if (!accommodation || !accommodation.accomCatId) {
      return res.status(404).json({ error: "Category not found" });
    }
    const categoryEmail = accommodation.accomCat.email;

    // If no email is found for the category, return an error
    if (!categoryEmail) {
      return res.status(400).json({ error: "No email found for category" });
    }
    console.log("Received accomCatId:", accomCatId);

    // Retrieve the predefined email text from the EmailSection table
    const emailMessage = accommodation.accomCat.emailMessages?.[0]; // Get first email message (if exists)
    const emailContent = emailMessage?.text
      ? emailMessage.text // Use predefined email text if available
      : `An accommodation request for ${accommodation.accomCat.name} has been approved.`;

    // const emailContent = accommodation.accomCat.emailMessages

    //   ? accommodation.accomCatId.emailMessage.text // Use predefined email text if available
    //   : `An accommodation request for ${accommodation.accomCat.name} has been approved.`; // Default fallback text
    console.log("here's the name ", accommodation.accomCat.name);
    // Replace placeholders in the email text with actual data
    const emailText = emailContent
      .replace("{studentId}", studentId)
      .replace("{semesterId}", semesterId);

    // Send the email using the email service
    await emailService.sendEmail({
      to: "d.ndayegamiye@eagles.oc.edu", // Send to the category-specific email address
      // subject: `Accommodation Approved`,
      subject: `Accommodation Approved: ${accommodation.accomCat.name}`, // Email subject line
      text: emailText, // Email body content
    });

    // Respond with success message
    res.status(200).json({ message: "Category email sent successfully" });
  } catch (error) {
    console.error("Error sending category email:", error); // Log any errors
    res.status(500).json({ error: "Failed to send category email" }); // Respond with an error message
  }
};

exports.getEmailDetails = async (req, res) => {
  try {
    const { accomCatId } = req.params;
    const accommodation = await db.accommodation.findOne({
      where: { accomCatId: accomCatId },
      include: [
        {
          model: db.accomCat, // Join with Category table
          as: "accomCat",
          include: [
            { model: db.emailMessage, as: "emailMessages" }, // Also join with EmailSection table
          ],
        },
      ],
    });

    if (!accommodation) {
      return res
        .status(404)
        .json({ message: "Accommodation category not found" });
    }

    const emailMessage = accommodation.accomCat.emailMessages?.[0]; // Get first email message (if exists)
    const emailContent = emailMessage?.text
      ? emailMessage.text // Use predefined email text if available
      : `An accommodation request for ${accommodation.accomCat.name} has been approved.`;
    // const emailMessage = accommodation.accomCat.emailMessages?.[0]; // Get first email message (if exists)
    // const emailContent = emailMessage?.text || "Default email content";
    const emailSubject = `Accommodation Approved: ${accommodation.accomCat.name}`; // Example subject

    res.json({ subject: emailSubject, content: emailContent });
  } catch (error) {
    console.error("Error fetching email details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
