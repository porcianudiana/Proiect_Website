import db from '../dbConfig.js';
import Sequelize from 'sequelize';


const CrewMember = db.define("CrewMember", {



    CrewMemberId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    CrewMemberNume: {
        type: Sequelize.STRING,
        validate: {
            len:
            {
                args: [5, 200],
                msg: "Nume trebuie sa aiba intre 5 si 200 caractere!"
            }
        },
        allowNull: false

    },

    CrewMemberRole: {
        type: Sequelize.STRING,
        validate: {
            isIn: {
                args: [['CAPTAIN', 'BOATSWAIN', 'MATE']],
                msg: "Trebuie sa fie captain boatswain sau mate"
            }
        },
        allowNull: false
    },
    ShipId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

export default CrewMember;