module.exports = (sequelize, Sequelize) => {
    const StudentAccom = sequelize.define('studentAccom', {
        studentAccomId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accomId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        data: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    }, {
        timestamps: false
    });

    return StudentAccom;
}