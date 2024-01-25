module.exports = (sequelize, Sequelize) => {
    const FacultySection = sequelize.define('facultySection', {
        facultySectionId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    }, {
        timestamps: false
    });

    return FacultySection;
}