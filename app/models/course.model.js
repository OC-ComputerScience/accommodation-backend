module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('course', {
        courseNumber: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: Sequelize.STRING(1080),
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return Course;
}