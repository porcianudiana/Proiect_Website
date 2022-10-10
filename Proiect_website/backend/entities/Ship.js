import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Ship = db.define("Ship", {


    ShipId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ShipNume: {
        type: Sequelize.STRING,
        validate: {
            len:
            {
                args: [3, 100],
                msg: "Nume trebuie sa aiba intre 3 si 100 caractere!"
            }
        },
        allowNull: false

    },
    ShipDisplacement: {
        type: Sequelize.INTEGER,
        validate: {
            min: {
                args: [50],
                msg: "Displacement trebuie sa fie mai mare ca 50!"
            }
        },
        allowNull: false

    }

})


export default Ship;