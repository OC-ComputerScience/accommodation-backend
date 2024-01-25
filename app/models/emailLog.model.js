module.exports = (sequelize, Sequelize) => {
    const EmailLog = sequelize.define('emailLog', {
        emailLogId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        receipt: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return EmailLog;
}