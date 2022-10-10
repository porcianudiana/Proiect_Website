const link = "http://localhost:8000/api";


const routeGetShipsFull = link + '/getShipsFull';
const routeGetShips = link + '/getShips';
const routeGetShipById = link + '/getShipById';
const routeGetCrewMembers = link + '/getCrewMembers';
const routeGetCrewMembersByShip = link + '/getCrewMembersByShip';
const routeGetCrewMemberByShip = link + '/getCrewMemberByShip';
const routeGetShipsFilter = link + '/getShipsFilter';
const routeGetShipsSortateDupaDisplacement = link + '/getShipsSortateDupaDisplacement';
const routeExportShipsFull = link + '/exportShipsFull';

const routePostShip = link + '/addShip';
const routePostCrewMember = link + '/addCrewMember';

const routeDeleteShip = link + '/deleteShip';
const routeDeleteCrewMember = link + '/deleteCrewMember';

const routePutShip = link + '/updateShip';
const routePutCrewMember = link + '/updateCrewMember';


export {
    routeGetShipsFull, routeGetShips, routeGetShipById, routeGetCrewMembers, routeGetCrewMembersByShip,
    routeGetCrewMemberByShip, routeGetShipsFilter, routeGetShipsSortateDupaDisplacement, routeExportShipsFull,
    routePostShip, routePostCrewMember,
    routeDeleteShip, routeDeleteCrewMember,
    routePutShip, routePutCrewMember
}