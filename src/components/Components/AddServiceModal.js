import React, { useEffect } from 'react'
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

import AdminApi from '../AdminApi/Api/api'

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

export default function AddServiceModal({ getAllServicesExists, isUpdate, serviceId, serviceNameProp }) {
    const [open, setOpen] = React.useState(false);
    const [serviceName, setServiceName] = React.useState('');

    const [snackBarValues, setSnackBarValues] = React.useState({
        open: false,
        msg: "",
        duration: 5000,
        type: ""
    })

    useEffect(() => {
        if (isUpdate) {
            setServiceName(serviceNameProp)
        }
    }, [])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const showDialog = (open, type, msg) => {
        setSnackBarValues({
            open: open,
            msg: msg,
            duration: 5000,
            type: type
        })

    }

    const closeDialog = (open = false) => {
        setSnackBarValues({
            open: open,
            msg: "",
            duration: 5000,
            type: ""
        })


    }

    const handleChange = (event) => {
        let value = event.target.value;
        let capitalText = value.toUpperCase();
        setServiceName(capitalText);
    }

    const onClickSave = () => {
        let payload = {
            service_name: serviceName
        }

        new AdminApi().addService(payload).then(res => {
            if (res) {
                handleClose();
                showDialog(true, "success", 'Service saved successfully')
            }
            getAllServicesExists()
        }).catch(err => {
            console.log(err)
            showDialog(true, "error", err?.response?.data?.message)
        })
    }

    const onClickUpdate = () => {
        let payload = {
            service_object_id: serviceId,
            service_name: serviceName
        }

        new AdminApi().updateService(payload).then(res => {
            if (res) {
                handleClose();
                showDialog(true, "success", 'Service updated successfully')
            }
            getAllServicesExists()
        }).catch(err => {
            console.log(err)
            showDialog(true, "error", err?.response?.data?.message)
        })
    }

    return (
        <div>
            {
                snackBarValues.open && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={snackBarValues.open} autoHideDuration={snackBarValues.duration} onClose={closeDialog}>
                    <Alert onClose={closeDialog} severity={snackBarValues.type} sx={{ width: '100%' }}>
                        {snackBarValues.msg}
                    </Alert>
                </Snackbar>
            }

            <div className='add-service-button'>
                <Button onClick={handleOpen} className="text-transform-none" variant="contained">{isUpdate ? "Edit Service" : "Add a Service"}</Button>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isUpdate ? "Edit Service" : "Add a Service"}
                    </Typography>
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <TextField
                            helperText="Please provide service name"
                            id="demo-helper-text-misaligned"
                            label="Service Name"
                            style={stylesCss.inputBox}
                            name="serviceName"
                            value={serviceName}
                            onChange={(event) => handleChange(event)}
                        />
                    </Grid>
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <Button
                            variant="contained"
                            onClick={isUpdate ? () => onClickUpdate() : () => onClickSave()}
                            disabled={!serviceName}
                        >
                            {isUpdate ? "Update" : "Save"}
                        </Button>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}