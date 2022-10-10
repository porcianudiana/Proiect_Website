import { useState, useEffect } from 'react';
import { get, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routeGetCrewMembersByShip, routeDeleteCrewMember } from '../ApiRoutes';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";

export default function TabelShips() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)

    useEffect(async () => {
        let data = await get(routeGetCrewMembersByShip, JSON.parse(sessionStorage.getItem("idShip")));
        setRows(data);
    }, [needToUpdate]);
    useEffect(async () => {
        sessionStorage.setItem("putScreen", "");
        sessionStorage.setItem("idShip", "");
    }, [])

    const goToFormularModificareCrewMember = (idCrewMember) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idShip", idCrewMember);
        navigate('/formularCrewMember');
    }

    const deleteCrewMember = async (idCrewMember, index) => {
        await remove(routeDeleteCrewMember, JSON.parse(sessionStorage.getItem("idShip")), idCrewMember);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }

    const goToFormularAdaugareCrewMember = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularCrewMember');
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Crewmember</TableCell>
                            <TableCell align="center">Crewmember name</TableCell>
                            <TableCell align="center">Crewmember Role</TableCell>
                            <TableCell align="center">Id ship</TableCell>
                            <TableCell align="center">Actiuni crewmember</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.CrewMemberId}>
                                <TableCell component="th" scope="row">
                                    {row.CrewMemberId}
                                </TableCell>
                                <TableCell align="center">{row.CrewMemberNume}</TableCell>
                                <TableCell align="center">{row.CrewMemberRole}</TableCell>
                                <TableCell align="center">{row.ShipId}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularModificareCrewMember(row.CrewMemberId)}>
                                        <EditIcon color="secondary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteCrewMember(row.CrewMemberId, index)}>
                                        <DeleteIcon color="primary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Button color="secondary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareCrewMember()}>
                Add crewmember
            </Button>
        </div >
    )
}