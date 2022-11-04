import React, { useEffect, useState } from 'react'
import AddServiceModal from '../../components/Components/AddServiceModal';
import ServicesList from '../../components/Components/ServicesList';

import AdminApi from '../../components/AdminApi/Api/api'
import CenterRegistrationApi from '../../components/centerRegistration/Api/api';
import { Alert, InputAdornment, Snackbar } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";

export default function AdminDashboard() {

    const [servicesList, setServicesList] = useState([]);
    const reduxState = useSelector((state) => state.userReducer);

    const [snackBarValues, setSnackBarValues] = useState({
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

    const getAllServicesExists = () => {
        new CenterRegistrationApi().getAllServices().then(res => {
            setServicesList(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getAllServicesExists();
    }, []);

    const onDeleteService = (serviceId) => {
        let payload = {
            serviceId: serviceId
        }
        new AdminApi().deleteService(payload).then(res => {
            if (res) {
                showDialog(true, "success", 'Service deleted successfully')
            }
            getAllServicesExists();
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
            Admin Dashboard

            {
                reduxState?.adminDetails?.role_id?.permissions?.add_new_services && <AddServiceModal getAllServicesExists={getAllServicesExists} />
            }

            {
                reduxState?.adminDetails?.role_id?.permissions?.view_services_list?.full_access ? <>
                    <ServicesList servicesList={servicesList} onDeleteService={onDeleteService} getAllServicesExists={getAllServicesExists} />

                </> : "No access to view services , contact admin"
            }
        </div>
    )
}