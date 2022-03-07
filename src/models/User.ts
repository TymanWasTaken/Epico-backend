import { DataTypes, Optional, Sequelize } from "sequelize";
import { BaseModel } from "./BaseModel";

interface UserAttributes {
    id: number;
    username: string;
    password: string;
}

export class User extends BaseModel<UserAttributes, Optional<UserAttributes, 'id'>> implements UserAttributes {
    declare id: number;
    declare username: string;
    declare password: string;

    static initModel(sequelize: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                sequelize
            }
        );
    }
}