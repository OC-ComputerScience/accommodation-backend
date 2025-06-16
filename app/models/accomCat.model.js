module.exports = (sequalize, Sequelize) => {
    const AccomCat = sequalize.define('accomCat', {
        accomCatId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        restricted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    }, {

        timestamps: false
    });

    return AccomCat;
}