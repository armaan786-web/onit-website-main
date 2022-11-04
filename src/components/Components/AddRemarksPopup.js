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

import CenterApi from '../../components/centerComponent/api/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    margin: 'auto',
    p: 2,
};

const stylesCss = {
    inputBox: {
        width: 350,
        textAlign: 'center',
        height: 50,
        margin: 20,


    },
    gridStyle: {
        width: '80%',
        margin: 'auto'
    },
    paddingInnerGrids: {


        textAlign: 'center',
    }

}

export default function AddRemarksPopup({
    open,
    ticketObj,
    handleClose
}) {
    const [additionalRemarks, setAdditionalRemarks] = React.useState('');

    const [snackBarValues, setSnackBarValues] = React.useState({
        open: false,
        msg: "",
        duration: 5000,
        type: ""
    })

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
        setAdditionalRemarks(value);
    }

    const onClickSave = () => {
        let payload = {
            ticket_obj_id: ticketObj._id,
            remarks: additionalRemarks,
            date: new Date()
        }

        console.log("payload is", payload);
        new CenterApi().addTicketRemarks(payload).then(res => {
            if (res) {
                handleClose();
                showDialog(true, "success", 'Remarks saved successfully')
            }
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


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* <div>
                        {ticketObj && ticketObj.remarks && ticketObj.remarks.additional_remarks && ticketObj.remarks.additional_remarks.length > 0 &&
                            ticketObj.remarks.additional_remarks.map((item) => {
                                return <div>
                                    {item.remarks}
                                </div>
                            })
                        }
                    </div> */}
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                        Add Remarks
                    </Typography>
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Add Remarks"
                            style={stylesCss.inputBox}
                            name="additionalRemarks"
                            value={additionalRemarks}
                            onChange={(event) => handleChange(event)}
                        />
                    </Grid>
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <Button
                            variant="contained"
                            onClick={() => onClickSave()}
                            disabled={!additionalRemarks}>
                            Save
                        </Button>
                    </Grid>
                </Box>
            </Modal >
        </div >
    );
}