const { request } = require("express");
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.accomCat = require("./accomCat.model.js")(sequelize, Sequelize);
db.accommodation = require("./accommodation.model.js")(sequelize, Sequelize);
db.course = require("./course.model.js")(sequelize, Sequelize);
db.emailLog = require("./emailLog.model.js")(sequelize, Sequelize);
db.emailMessage = require("./emailMessage.model.js")(sequelize, Sequelize);
db.facultySection = require("./facultySection.model.js")(sequelize, Sequelize);
db.facultyStaff = require("./facultyStaff.model.js")(sequelize, Sequelize);
db.request = require("./request.model.js")(sequelize, Sequelize);
db.section = require("./section.model.js")(sequelize, Sequelize);
db.semester = require("./semester.model.js")(sequelize, Sequelize);
db.student = require("./student.model.js")(sequelize, Sequelize);
db.studentAccom = require("./studentAccom.model.js")(sequelize, Sequelize);
db.studentSection = require("./studentSection.model.js")(sequelize, Sequelize);

// foreign key for student section
db.studentSection.belongsTo(db.student, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
  allowNull: false
});
db.studentSection.belongsTo(db.section, {
  foreignKey: "sectionId",
  onDelete: "CASCADE",
  allowNull: false
});
// bidirectionality for FKs for student section
db.student.hasMany(db.studentSection, {
  foreignKey: "studentId"
});
db.section.hasMany(db.studentSection, {
  foreignKey: "sectionId"
});

// foreign key for accommodation
db.accommodation.belongsTo(db.accomCat, {
  foreignKey: "accomCatId",
  allowNull: false
});
db.accomCat.hasMany(db.accommodation, {
  foreignKey: "accomCatId"
});

// foreign key for student accommodation
db.studentAccom.belongsTo(db.semester, {
  foreignKey: "semesterId",
  onDelete: "CASCADE",
  allowNull: false
});
db.studentAccom.belongsTo(db.accommodation, {
  foreignKey: "accomId",
  onDelete: "CASCADE",
  allowNull: false
});
db.studentAccom.belongsTo(db.student, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
  allowNull: false
});
// Bidirectionality for student accommodation
db.semester.hasMany(db.studentAccom, {
  foreignKey: "semesterId"
});
db.accommodation.hasMany(db.studentAccom, {
  foreignKey: "accomId"
});
db.student.hasMany(db.studentAccom, {
  foreignKey: "studentId"
});

// foreign key for request
db.request.belongsTo(db.student, {
  foreignKey: "studentId",
  onDelete: "CASCADE"
});
db.request.belongsTo(db.semester, {
  foreignKey: "semesterId",
  onDelete: "CASCADE"
});
// Bidirectionality for request
db.student.hasMany(db.request, {
  foreignKey: "studentId"
});
db.semester.hasMany(db.request, {
  foreignKey: "semesterId"
});

// foreign key for section
db.section.belongsTo(db.course, {
  foreignKey: "courseNumber",
  onDelete: "CASCADE"
});
db.section.belongsTo(db.semester, {
  foreignKey: "semesterId",
  onDelete: "CASCADE"
});
// Bidirectionality for section
db.course.hasMany(db.section, {
  foreignKey: "courseNumber"
});
db.semester.hasMany(db.section, {
  foreignKey: "semesterId"
});

// foreign key for faculty section
db.facultySection.belongsTo(db.section, {
  foreignKey: "sectionId",
  onDelete: "CASCADE"
});
db.facultySection.belongsTo(db.facultyStaff, {
  foreignKey: "facultyId",
  onDelete: "CASCADE"
});
// Bidirectionality for faculty section
db.section.hasMany(db.facultySection, {
  foreignKey: "sectionId"
});
db.facultyStaff.hasMany(db.facultySection, {
  foreignKey: "facultyId"
});

// foreign key for facultyStaff
db.facultyStaff.belongsTo(db.accomCat, {
  foreignKey: "accomCatId",
  allowNull: true
})

// foreign key for user
db.user.belongsTo(db.student, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
  allowNull: true,
});
// Bidirectionality for user
db.student.hasOne(db.user, {
  foreignKey: "studentId"
});

db.session.belongsTo(db.user, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});
db.user.hasMany(db.session, {
  foreignKey: "userId"
});

// foreign key for email log
db.emailLog.belongsTo(db.studentAccom, {
  foreignKey: "studAccId",
  onDelete: "CASCADE"
});
db.studentAccom.hasMany(db.emailLog, {
  foreignKey: "studAccId"
});

//foreign key for emailMessage
db.emailMessage.hasMany(db.accomCat, {
  foreignKey: "emailMessageId",
  onDelete: "CASCADE"
})

module.exports = db;