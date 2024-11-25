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
            defaultValue: Sequelize.NOW
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'General'
        },
        studentId: {           
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'students', 
                key: 'studentId'
            }
        },
        toEmailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        senderEmail: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'system@oc.edu',
            validate: {
                isEmail: true
            }
        },
        messageContent: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false
    });

    EmailLog.associate = (models) => {
        EmailLog.belongsTo(models.student, { 
            foreignKey: 'studentId',
            targetKey: 'studentId',
            as: 'student'
        });
    };

    return EmailLog;
};