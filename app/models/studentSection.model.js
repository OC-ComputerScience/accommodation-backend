module.exports = (sequelize, Sequelize) => {
  const StudentSection = sequelize.define("studentSection", {
    studentSectionId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    }
  }, {
    timestamps: false
  });

  return StudentSection;
};
