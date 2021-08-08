"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: "userId",
      });

      this.hasMany(models.like, {
        foreignKey: "id",
      });
    }
  }
  board.init(
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isLike: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "board",
    }
  );
  return board;
};
