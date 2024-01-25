module.exports = (sequelize, Sequelize) => {
    const Semester = sequelize.define('semester', {
        semesterId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        season: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        year: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return Semester;
}