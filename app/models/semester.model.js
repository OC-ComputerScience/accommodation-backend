module.exports = (sequelize, Sequelize) => {
    const Semester = sequelize.define('semester', {
        semesterId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        semester: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return Semester;
}