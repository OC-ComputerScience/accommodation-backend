module.exports = (sequelize, Sequelize) => {
    const Section = sequelize.define('section', {
        sectionId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    }, {
        timestamps: false
    });

    return Section; s
}