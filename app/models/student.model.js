module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
    studentId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    lName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ocStudentId: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    permission: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    dateSigned: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    version: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
  }, {
    timestamps: false
  });

  return Student;
};
