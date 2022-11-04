import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddServiceModal from '../Components/AddServiceModal';
import { Alert, FormControlLabel, FormGroup, InputAdornment, Snackbar, Switch, Typography } from '@mui/material'
import AdminApi from '../AdminApi/Api/api'

export default function ServicesList({ servicesList, onDeleteService, getAllServicesExists }) {
    const [isServiceActive, setIsServiceActive] = useState(true)

    // const handleChangeCheckBox = (e) => {
    //     console.log('event is', e.target.value, e.target.checked)
    //     console.log(e.target.value, "llll")
    //     setIsServiceActive(e.target.value)
    // }

    const handleChangeCheckBox = (e, serviceId) => {
        console.log('event is', e.target.value, e.target.checked)
        let isActive = e.target.checked ? 1 : 0;
        console.log('isActive value', isActive);

        let payload = {
            service_object_id: serviceId,
            is_active: isActive
        }

        new AdminApi().updateServiceStatus(payload).then(res => {
            if (res) {
                // handleClose();
                // showDialog(true, "success", 'Service updated successfully')
            }
            getAllServicesExists()
        }).catch(err => {
            console.log(err)
            // showDialog(true, "error", err?.response?.data?.message)
        })
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Service Name</TableCell>
                        <TableCell>Service Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {servicesList && servicesList.length > 0 && servicesList.map((row) => (
                        <TableRow
                            key={row.service_name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.service_name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {/* {row.is_active} */}
                                <FormGroup>
                                    <FormControlLabel control={<Switch checked={row.is_active} onChange={(e) => handleChangeCheckBox(e, row._id)} />} label={row.is_active ? 'ACTIVE' : 'IN_ACTIVE'} />
                                </FormGroup>
                            </TableCell>
                            {/* <TableCell>
                                <Button onClick={() => { onDeleteService(row._id) }} variant="outlined" startIcon={<DeleteIcon />}>
                                    Delete
                                </Button>
                            </TableCell> */}
                            <TableCell>
                                <AddServiceModal getAllServicesExists={getAllServicesExists} isUpdate={true} serviceId={row._id} serviceNameProp={row.service_name} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}