require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./app/models");

let alterDB = false;

const args = process.argv.slice(2);
if (args[0] === "alter") {
  console.log("NOTICE: Altering Database Tables\n\n");
  alterDB = true;
}

db.sequelize.sync({ alter: alterDB});

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to accommodations application." });
});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/request.routes.js")(app);
require("./app/routes/accommodation.routes.js")(app);
require("./app/routes/accomCat.routes.js")(app);
require("./app/routes/student.routes.js")(app);
require("./app/routes/course.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/emailLog.routes.js")(app);
require("./app/routes/facultySection.routes.js")(app);
require("./app/routes/facultyStaff.routes.js")(app);
require("./app/routes/studentAccom.routes.js")(app);
require("./app/routes/util.routes.js")(app);
require("./app/routes/semester.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3024;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
module.exports = app;
