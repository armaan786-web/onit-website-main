import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

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
const ariaLabel = { 'aria-label': 'description' };

export default function TicketEditPincodePopup({
    open,
    handleClose,
    isPincodeUpdating,
    handleUpdatePincode,
    isEditOpenTicketDetails
}) {

    const [newPincode, setnewPincode] = useState(isEditOpenTicketDetails?.address_details?.pincode)

    const handleChange = (e) => {
        setnewPincode(e.target.value)
    }
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Edit pincode
                </Typography>
                <br />

                <br />

                <Box sx={{ minWidth: 120 }}>
                    <Input value={newPincode} type="number" onChange={handleChange} label="Enter pincode" inputProps={ariaLabel} />

                </Box>
                <br />
                <br />


                <Button
                    onClick={() => handleUpdatePincode(newPincode)}
                    variant="contained"
                    disabled={isPincodeUpdating}
                >
                    {isPincodeUpdating ? "updating " : "update pincode"}
                </Button>

            </Box>

        </Modal>

    )
}
