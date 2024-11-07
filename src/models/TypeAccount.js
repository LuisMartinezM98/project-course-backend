const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");


const TypeAccount = sequelize.define(
    'type_accounts', {
        id_type_account:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        type_account:{
            type: DataTypes.STRING(10),
            allowNull: false
        },
    },{
        tableName: 'type_accounts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }
);


module.exports = TypeAccount;