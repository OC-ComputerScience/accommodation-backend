// const express = require("express");
// const router = express.Router();

// // Route for approving accommodations
// module.exports = (app) => {
//     app.post("/api/accommodations/approve", accommodationAdminController.approveAccommodation);
// };


// module.exports = router;



const express = require("express");
const router = express.Router();
const accommodationAdminController = require("../controllers/accommodationAdminController.js");

// Define the route for sending category-based emails
router.post("/sendCategoryEmail", accommodationAdminController.sendCategoryEmail);

router.get("/getEmailDetails/:accomCatId", accommodationAdminController.getEmailDetails);


// Use the same base path format as other routes
module.exports = (app) => {
  app.use("/accommodations-t4/accommodationsAdmin", router);
};

  