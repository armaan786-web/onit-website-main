import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

export default function ChangeTechnician({
    open,
    handleClose,
    technicianList,
    handleAssignTechnician,
    isTechnicianAssigning
}) {

    const [technicianSelected, setTechnicianSelected] = useState("")

    const handleChange = (e) => {
        console.log(e.target.value, "llll")
        setTechnicianSelected(e.target.value)
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
                    Assign technician
                </Typography>
                <br />

                <br />

                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Choose Technician</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={technicianSelected}
                            label="Choose Technician"
                            onChange={handleChange}
                        >
                            {technicianList?.map(ite => {
                                return <MenuItem value={ite?._id}>{ite?.personal_details?.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Box>
                <br />
                <br />


                <Button
                    onClick={() => handleAssignTechnician(technicianSelected)}
                    variant="contained"
                    disabled={isTechnicianAssigning}
                >
                    {isTechnicianAssigning ? "Assiging " : "Assign Techician"}
                </Button>

            </Box>

        </Modal>

    )
}
