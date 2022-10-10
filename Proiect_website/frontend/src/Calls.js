import axios from 'axios'

import {
    routeGetShipsFull, routeGetShips, routeGetShipById, routeGetCrewMembers, routeGetCrewMembersByShip,
    routeGetCrewMemberByShip, routeGetShipsFilter, routeGetShipsSortateDupaDisplacement, routeExportShipsFull,
    routePostShip, routePostCrewMember,
    routeDeleteShip, routeDeleteCrewMember,
    routePutShip, routePutCrewMember
} from './ApiRoutes.js'

async function get(p_url, searchAfter1 = null, searchAfter2 = null) {
    try {
        let newUrl;
        if (searchAfter1) {
            newUrl = p_url + "/" + searchAfter1;
            if (searchAfter2) {
                newUrl = newUrl + "/" + searchAfter2;
            }
        } else {
            newUrl = p_url;
        }

        return (await axios.get(newUrl)).data;

    } catch (err) {
        if (p_url === routeGetShipsFull)
            alert('Nu s-au putut prelua the ships full.');
        if (p_url === routeGetShips)
            alert('Nu s-au putut prelua the ships.');
        if (p_url === routeGetCrewMembers)
            alert('Nu s-au putut prelua the crew members.');
        if (p_url === routeGetShipsSortateDupaDisplacement)
            alert('Nu s-au putut prelua the ships sortate.');
        if (p_url === routeExportShipsFull)
            alert('Nu s-au putut exporta the ships full.');
        if (p_url === routeGetShipById)
            alert('Nu s-a putut prelua the ship cu acest id.');
        if (p_url === routeGetCrewMembersByShip)
            alert('Nu s-au putut prelua the crewmembers din ship-ul acesta.');
        if (p_url === routeGetCrewMemberByShip)
            alert('Nu s-a putut prelua acest crewmember din ship-ul acesta.');
    }
}


async function getQuery(p_url, p_nume, p_displacement) {
    try {
        const params = new URLSearchParams({ nume: p_nume, displacement: p_displacement });
        let urlFilter = p_url + "?";
        return (await axios.get(`${urlFilter}${params}`)).data;
    } catch (err) {
        alert("Nu s-au putut prelua ship-urile filtrate dupa nume si displacement.");
    }
}


async function post(p_url, item, id = null) {
    try {
        let newUrl = id ? p_url + "/" + id : p_url;
        return (await axios.post(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePostShip) {
            alert('Error when inserting ship!');
        }
        if (p_url === routePostCrewMember) {
            alert('Error when inserting crewmember!');
        }
    }
}


async function put(p_url, item, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.put(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePutShip) {
            alert('Error when modifying ship!');
        }
        if (p_url === routePutCrewMember) {
            alert('Error when modifying crewmember!');
        }
    }
}


async function remove(p_url, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.delete(newUrl)).data;
    } catch (err) {
        if (p_url === routeDeleteShip) {
            alert('Error when deleting ship!');
        }
        if (p_url === routeDeleteCrewMember) {
            alert('Error when deleting crewmember!');
        }
    }
}


export { get, getQuery, post, put, remove }