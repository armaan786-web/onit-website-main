import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Alert, InputAdornment, Snackbar } from '@mui/material'

const style = {
    flex: 1,
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

    },
    dialogInputBox: {
        height: 70,
        padding: 10,
        width: 300,

    },
    gridStyle: {

    },
    paddingInnerGrids: {
        paddingRight: "10px",
        paddingLeft: "10px",
        paddingTop: "10px",
        margin: 10,
        justifyContent: "center"
    },
    dialogAlignBox: {

    }

}

let feedBackOptionList = [
    "Visit Done, Work Completed",
    "Visited - Estimate Not Approved / Site Not Ready",
    "Visited - Unit not Repairable /Special Skill, Tools, Authorisation required",
    "Not Visited -Can’t Deliver Service - Phone not Pick/ Far Location",
    "Not Visited - Customer Refused (Work Already Done /Not Needed / Site Not Ready)",
]

export default function AssignTechnician({
    open,
    handleClose,
    handleCloseTicket
}) {

    const [closingTicketRemarks, setClosingTicketRemarks] = useState("")
    const [closingPrice, setClosingPrice] = useState(0)

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

    const handleChange = (e) => {
        console.log(e.target.value, "closingTicketRemarks")
        setClosingTicketRemarks(e.target.value)
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
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Closing Remarks
                    </Typography>
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Closing Remarks"
                            placeholder="Please select"
                            name="closingTicketRemarks"
                            style={stylesCss.inputBox}

                            onChange={(event) => handleChange(event)}
                            value={closingTicketRemarks}


                        >
                            {feedBackOptionList?.map(ite => {
                                return <MenuItem value={ite}>
                                    {ite}
                                </MenuItem>
                            })}
                        </Select>
                        {/* <TextField
                            id="demo-helper-text-misaligned"
                            label="Closing Remarks"
                            style={stylesCss.inputBox}
                            name="closingTicketRemarks"
                            value={closingTicketRemarks}
                            onChange={(event) => handleChange(event)}
                        /> */}
                    </Grid>
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <TextField
                            id="demo-helper-text-misaligned"
                            label="Amount"
                            style={stylesCss.inputBox}
                            name="closingTicketRemarks"
                            value={closingPrice}
                            onChange={(event) => setClosingPrice(event.target.value)}
                        />
                    </Grid >
                    <Grid style={stylesCss.paddingInnerGrids} item>
                        <Button
                            variant="contained"
                            onClick={() => handleCloseTicket(closingTicketRemarks, closingPrice)}
                            disabled={!closingTicketRemarks}
                        >
                            Close the ticket
                        </Button>
                    </Grid>
                </Box >
            </Modal >

        </div >
    )
}