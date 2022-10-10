import { useState, useEffect } from 'react';
import { get, getQuery, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routeGetShips, routeGetShipsFilter, routeGetShipsSortateDupaDisplacement, routeExportShipsFull, routeDeleteShip } from '../ApiRoutes';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";

export default function TabelShips() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)
    const [filtrare, setFiltrare] = useState({
        ShipNume: "",
        ShipDisplacement: ""
    })


    useEffect(async () => {
        let data = await get(routeGetShips);
        setRows(data);
    }, [needToUpdate]);
    useEffect(async () => {
        sessionStorage.clear();
    }, [])


    const onChangeFiltrare = e => {
        setFiltrare({ ...filtrare, [e.target.name]: e.target.value });
    }
    const filtrareShips = async () => {
        let data = await getQuery(routeGetShipsFilter, filtrare.ShipNume, filtrare.ShipDisplacement);
        setRows(data);
    }
    const goToFormularModificareShip = (id) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idShip", id);
        navigate('/formularShip');
    }
    const goToFormularAdaugareShip = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularShip');
    }
    //nu merge export
    const exporta = async () => {
        await get(routeExportShipsFull);
    }
    const deleteShip = async (id, index) => {
        await remove(routeDeleteShip, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }
    const sortare = async () => {
        let data = await get(routeGetShipsSortateDupaDisplacement);
        setRows(data);
    }

    const goToFormularAdaugareCrewMember = (idShip) => {
        sessionStorage.setItem("putScreen", "false");
        sessionStorage.setItem("idShip", idShip);
        navigate('/formularCrewMember');
    }

    const goToTabelCreMembers = (idShip) => {
        sessionStorage.setItem("idShip", idShip);
        navigate('/crewmembers')
    }

    return (
        <div>
            <Grid container spacing={3}
                direction="column"
                justifyContent="space-evenly"
                alignItems="center">

                <Grid container item spacing={2} xs={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center">

                    <TextField
                        margin="normal"
                        id="ShipNume"
                        name="ShipNume"
                        label="Filtrare dupa nume"
                        fullWidth
                        value={filtrare.ShipNume}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <TextField
                        margin="normal"
                        id="ShipDisplacement"
                        name="ShipDisplacement"
                        label="Filtrare dupa displacement"
                        fullWidth
                        value={filtrare.ShipDisplacement}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <Button color="secondary" variant='contained' onClick={() => filtrareShips()}
                    >
                        Filtrare
                    </Button>

                </Grid>

                <Grid item xs={3}>
                    <Button color="secondary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareShip()}>
                        Add ship
                    </Button >
                </Grid>

                <Grid item xs={3}>
                    <Button color="secondary" variant='contained' onClick={() => sortare()}>
                        Sort after displacement
                    </Button >
                </Grid>

                <Grid item xs={3}>
                    <Button color="secondary" variant='contained' onClick={() => exporta()}>
                        Export ships
                    </Button >
                </Grid>
            </Grid>

            <br />

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Ship</TableCell>
                            <TableCell align="center">Ship name</TableCell>
                            <TableCell align="center">Ship displacement</TableCell>
                            <TableCell align="center">Crewmembers</TableCell>
                            <TableCell align="center">Actiuni ships</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ShipId}>
                                <TableCell component="th" scope="row">
                                    {row.ShipId}
                                </TableCell>
                                <TableCell align="center">{row.ShipNume}</TableCell>
                                <TableCell align="center">{row.ShipDisplacement}</TableCell>
                                <TableCell align="center">
                                    <Button color="secondary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareCrewMember(row.ShipId)}>
                                        Add crewmember
                                    </Button>
                                    <br /> <br />
                                    <Button color="secondary" variant='contained' onClick={() => goToTabelCreMembers(row.ShipId)}>
                                        Crewmembers
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularModificareShip(row.ShipId)}>
                                        <EditIcon color="secondary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteShip(row.ShipId, index)}>
                                        <DeleteIcon color="primary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}