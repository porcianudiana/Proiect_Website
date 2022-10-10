import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import { DB_USERNAME, DB_PASSWORD } from './Const.js';
import db from './dbConfig.js';
import Ship from './entities/Ship.js';
import CrewMember from './entities/CrewMember.js';
import LikeOperator from './Operators.js'

import fs from 'fs';
'use strict';

let app = express();
let router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

let conn;
mysql.createConnection({

    user: DB_USERNAME,
    password: DB_PASSWORD
}).then(connection => {
    conn = connection;
    return connection.query("CREATE DATABASE IF NOT EXISTS ExamenE")
})
    .then(() => {
        return conn.end();
    })
    .catch(err => {
        console.log(err);
    })


//legatura one to many intre cele doua entitati
Ship.hasMany(CrewMember, { as: "CrewMember", foreignKey: "ShipId" });
CrewMember.belongsTo(Ship, { foreignKey: "ShipId" });



//get
//afisare ships impreuna cu crewmembers aferenti  
async function getShipsFull() {
    return await Ship.findAll({ include: ["CrewMember"] });
}
router.route('/getShipsFull').get(async (req, res) => {
    try {
        return res.json(await getShipsFull());
    }
    catch (err) {
        console.log(err.message);
    }
})

//afisare doar ships, fara crewmembers lor   
async function getShips() {
    return await Ship.findAll();
}
router.route('/getShips').get(async (req, res) => {
    try {
        return res.json(await getShips());
    }
    catch (err) {
        console.log(err.message);
    }
})
//afisare ship cu un anumit id  
async function getShipById(id) {
    return await Ship.findOne(
        {
            where: id ? { ShipId: id } : undefined
        }
    );
}
router.route('/getShipById/:id').get(async (req, res) => {
    try {
        return res.json(await getShipById(req.params.id));
    }
    catch (err) {
        console.log(err.message);
    }
})
//afisare toti crewmembers  
async function getCrewMembers() {
    return await CrewMember.findAll();
}
router.route('/getCrewMembers').get(async (req, res) => {
    try {
        return res.json(await getCrewMembers());
    }
    catch (err) {
        console.log(err.message);
    }
})
//afisare crewmembers ale unui anumit ship    
async function getCrewMembersByShip(idShip) {
    return await CrewMember.findAll({
        include: [{ model: Ship, attributes: ["ShipNume"], where: idShip ? { ShipId: idShip } : undefined }]
    });
}
router.route('/getCrewMembersByShip/:idShip').get(async (req, res) => {
    try {
        return res.json(await getCrewMembersByShip(req.params.idShip));
    }
    catch (err) {
        console.log(err.message);
    }
})

//afisarea unui anumit crewmember dintr-un ship  
async function getCrewMemberByShip(idShip, idCrewMember) {
    if (!(await getShipById(idShip))) {
        console.log("Ship not found!");
        return;
    }
    return await CrewMember.findOne(
        {
            include: [{ model: Ship, attributes: ["ShipNume"], where: idShip ? { ShipId: idShip } : undefined }],
            where: idCrewMember ? { CrewMemberId: idCrewMember } : undefined
        }
    )
}
router.route('/getCrewMemberByShip/:idShip/:idCrewMember').get(
    async (req, res) => {
        try {
            return res.json(await getCrewMemberByShip(req.params.idShip, req.params.idCrewMember));
        } catch (err) {
            console.log(err.message);
        }
    }
)

//afisarea tuturor ship-urilor unde numele contine CEVA si/sau displacement contine ALTCEVA  
async function getShipsFilter(filterQuery) {
    let whereClause = {};

    if (filterQuery.nume)
        whereClause.ShipNume = { [LikeOperator]: `%${filterQuery.nume}%` };
    if (filterQuery.displacement)
        whereClause.ShipDisplacement = { [LikeOperator]: `%${filterQuery.displacement}%` };

    return await Ship.findAll({
        where: whereClause
    })
}
router.route('/getShipsFilter').get(async (req, res) => {
    try {
        return res.json(await getShipsFilter(req.query));
    }
    catch (err) {
        console.log(err.message);
    }
})

//afisare ships sortate descrescator dupa displacement
async function getShipsSortateDupaDisplacement() {
    return await Ship.findAll({
        order: [
            ["ShipDisplacement", "DESC"]
        ]
    });
}
router.route('/getShipsSortateDupaDisplacement').get(async (req, res) => {
    try {
        return res.json(await getShipsSortateDupaDisplacement());
    }
    catch (err) {
        console.log(err.message);
    }
})

//export sub forma de json
async function exportShipsFull() {
    if (!fs.existsSync("./exported"))
        fs.mkdirSync("./exported")
    fs.writeFileSync("./exported/ship_full.json", JSON.stringify(await getShipsFull()));
}
router.route('/exportShipsFull').get(async (req, res) => {
    try {
        await exportShipsFull();
        res.download("./exported/ships_full.json", "downloadShipsFull.json");
    } catch (err) {
        console.log(err.message);
    }
})
//post
async function createShip(ship) {
    return await Ship.create(ship);
}
router.route('/addShip').post(async (req, res) => {
    try {
        return res.status(201).json(await createShip(req.body));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert ship!" });
    }
})
async function createCrewMember(crewmember, idShip) {
    if (!(await getShipById(idShip))) {
        console.log("Ship not found!");
        return;
    }
    crewmember.ShipId = idShip;
    return await CrewMember.create(crewmember);
}
router.route('/addCrewMember/:idShip').post(async (req, res) => {
    try {
        return res.status(201).json(await createCrewMember(req.body, req.params.idShip));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert crewmember!" });
    }
})

//put

async function updateShip(updatedShip, idShip) {
    if (parseInt(idShip) !== updatedShip.ShipId) {
        console.log("ID diferit intre id ruta si id body");
        return;
    }
    let ship = await getShipById(idShip);
    if (!ship) {
        console.log("The ship with this id does not exist");
        return;
    }

    return await ship.update(updatedShip);
}
router.route("/updateShip/:idShip").put(async (req, res) => {
    try {
        return res.json(await updateShip(req.body, req.params.idShip));
    } catch (err) {
        console.log(err.message);
    }
})

//update crewmember a unui ship   
async function updateCrewMember(updatedCrewMember, idShip, idCrewMember) {
    if (parseInt(idCrewMember) !== updatedCrewMember.CrewMemberId) {
        console.log("ID referinta diferit intre id ruta si id body");
        return;
    }

    let ship = await getShipById(idShip);
    if (!ship) {
        console.log("The ship with this id does not exist");
        return;
    }

    let crewmember = await getCrewMemberByShip(idShip, idCrewMember);
    if (!crewmember) {
        console.log("There is not a crewmember with this id for this article");
        return;
    }

    return await crewmember.update(updatedCrewMember);
}
router.route("/updateCrewMember/:idShip/:idCrewMember").put(async (req, res) => {
    try {
        return res.json(await updateCrewMember(req.body, req.params.idShip, req.params.idCrewMember));
    } catch (err) {
        console.log(err.message);
    }
})

//delete
//sterge ship 
async function deleteShip(idShip) {
    let shipToBeDeleted = await getShipById(idShip);

    if (!shipToBeDeleted) {
        console.log("The ship with this id does not exist");
        return;
    }

    return await shipToBeDeleted.destroy();
}
router.route("/deleteShip/:idShip").delete(async (req, res) => {
    try {
        return res.json(await deleteShip(req.params.idShip));
    } catch (err) {
        console.log(err.message);
    }
})

//stergere crewmember a unui anumit ship  
async function deleteCrewMember(idShip, idCrewMember) {

    let ship = await getShipById(idShip);
    if (!ship) {
        console.log("The ship with this id does not exist");
        return;
    }

    let crewmemberToBeDeleted = await getCrewMemberByShip(idShip, idCrewMember);

    if (!crewmemberToBeDeleted) {
        console.log("The crewmember with this id does not exist for this ship");
        return;
    }

    return await crewmemberToBeDeleted.destroy();
}
router.route("/deleteCrewMember/:idShip/:idCrewMember").delete(async (req, res) => {
    try {
        return res.json(await deleteCrewMember(req.params.idShip, req.params.idCrewMember));
    } catch (err) {
        console.log(err.message);
    }
})

let port = process.env.PORT || 8000;
app.listen(port, async () => {
    await db.sync({ alter: true });
    console.log("Baza de date este sincronizata cu succes!");
});
console.log("API is running at " + port);