module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define('request', {
        requestId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        dateMade: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        dateApproved: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        approvedBy: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'manual',
        },
    },{
        timestamps: false
    });

    return Request;
}