module.exports = (sequelize, Sequelize) => {
    const EmailMessage = sequelize.define('emailMessage', {
        emailMessageId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        text: {
            type: Sequelize.STRING(2000),
            allowNull: true,
          
        }
    }, {

        timestamps: false
    });

    return EmailMessage;
}