import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { Alert, InputAdornment, Snackbar } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import AdminApi from './Api/api'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const stylesCss = {
    inputBox: {
        width: '100%',
        marginBottom: "10px"
    },
    gridStyle: {
        width: '80%',
        margin: 'auto'
    },
    paddingInnerGrids: {
        paddingRight: "10px",
        paddingLeft: "10px",
        paddingTop: "10px"
    }
}

export default function ViewActions({
    isAuthorizedForPopupOpen,
    clientsList,
    toggleAuthorizedForPopup,
    saveAuthorizedCenters
}) {

    const [centersSelected, setCentersSelected] = React.useState([]);

    const handleChange = (event) => {
        let value = event.target.value;
        setCentersSelected(value);
    }

    return (
        <div>
            <Modal
                open={isAuthorizedForPopupOpen}
                onClose={toggleAuthorizedForPopup}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Authorized Center For Clients
                    </Typography>
                    <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                        <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-helper-label">Authorized For</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                label="Authorized For"
                                name="centersSelected"
                                onChange={handleChange}
                                value={centersSelected}
                                multiple
                            // error={isFormValid && !centersSelected}

                            >
                                {clientsList?.map(ite => {
                                    return <MenuItem key={ite._id} value={ite._id}>
                                        {ite.client_name}
                                    </MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <Button
                            variant="contained"
                            onClick={() => saveAuthorizedCenters(centersSelected)}
                            disabled={!centersSelected}
                        >
                            Save
                        </Button>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}