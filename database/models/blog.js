/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "blog",
    {
      uri: {
        type: DataTypes.STRING,
        unique: true,
      },
      title: DataTypes.STRING,
      shortDescription: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      body: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      tableName: "image",
    }
  );
};
