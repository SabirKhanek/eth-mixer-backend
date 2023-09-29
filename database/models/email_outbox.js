
/**
 * @param {import('sequelize').Sequelize} sequelize 
 * @param {import('sequelize').DataTypes} DataTypes 
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('email_outbox', {
        email_obj: {
            type: DataTypes.JSON,
            primaryKey: true
        }
    },{
        tableName: 'email_outbox'
    })
}