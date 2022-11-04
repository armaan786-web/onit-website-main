import React, { Component } from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import '../../../Styles/style.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AdminApiModule from '../../../components/AdminApi/Api/api';
import { withRouter } from "react-router";

import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'


import CenterRegistrationApi from '../../../components/centerRegistration/Api/api';
import { connect } from 'react-redux';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,

}));

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

class AddRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleName: '',
            addCenter: false,
            updateCenterFullAccess: false,
            deleteCenter: false,
            viewCenterDetailsFullAccess: false,
            viewCenterDetailsViewPincode: false,
            addTechnician: false,
            updateTechnicianFullAccess: false,
            deleteTechnician: false,
            viewTechnicianDetailsFullAccess: false,
            viewTechnicianDetailsTechnicianPhone: false,
            viewDashboardFullAccess: false,
            addNewServices: false,
            updateServicesFullAccess: false,
            inActiveActive: false,
            viewServicesListFullAccess: false,
            addTicket: false,
            editTicketFullAccess: false,
            deleteTicket: false,
            viewTicketFullAccess: false,
            addClients: false,
            editClientsFullAccess: false,
            viewClientsFullAccess: false,
            viewBroadcastedListFullAccess: false,
            addRole: false,
            editRoleFullAccess: false,
            deleteRole: false,
            viewRoleFullAccess: false,

            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
            isFormValid: false,

            isRegistering: false,
            isEditDetailsExists: false,
            doesRoleExists: false,

        };
    }

    componentDidMount() {
        console.log("hey man", this.props.reduxState)

        let editRoleId = new URLSearchParams(this.props.location.search).get("edit")

        console.log(editRoleId, "edit role id")

        if (editRoleId != null) {
            this.getRoleDetails(editRoleId)
        }


    }

    getRoleObjIdForEdit() {
        return new URLSearchParams(this.props.location.search).get("edit")
    }

    getRoleDetails(editRoleId) {
        let payload = {
            role_obj_id: editRoleId
        }
        this.setState({
            isEditDetailsExists: true,
        })

        new AdminApiModule().getAllAvailableRoles(payload).then(res => {
            if (res?.data?.length) {
                this.setState({
                    doesRoleExists: true,
                })

                this.updateRoleDetails(res?.data?.[0])
            }

        }).catch(err => {
            console.log(err)
        })
    }

    updateRoleDetails(roleDetails) {
        console.log("roleDetails are", roleDetails?.add_center)
        this.setState({
            roleName: roleDetails?.role_name,
            addCenter: roleDetails?.permissions?.add_center,
            updateCenterFullAccess: roleDetails?.permissions?.update_center?.full_access,
            deleteCenter: roleDetails?.permissions?.delete_center,
            viewCenterDetailsFullAccess: roleDetails?.permissions?.view_center_details?.full_access,
            viewCenterDetailsViewPincode: roleDetails?.permissions?.view_center_details?.view_pincode,
            addTechnician: roleDetails?.permissions?.add_technician,
            updateTechnicianFullAccess: roleDetails?.permissions?.update_technician?.full_access,
            deleteTechnician: roleDetails?.permissions?.delete_technician,
            viewTechnicianDetailsFullAccess: roleDetails?.permissions?.view_technician_details?.full_access,
            viewTechnicianDetailsTechnicianPhone: roleDetails?.permissions?.view_technician_details?.technician_phone,
            viewDashboardFullAccess: roleDetails?.permissions?.view_dashboard_full_access,
            addNewServices: roleDetails?.permissions?.add_new_services,
            updateServicesFullAccess: roleDetails?.permissions?.update_services?.full_access,
            inActiveActive: roleDetails?.permissions?.inactive_active,
            viewServicesListFullAccess: roleDetails?.permissions?.view_services_list?.full_access,
            addTicket: roleDetails?.permissions?.add_ticket,
            editTicketFullAccess: roleDetails?.permissions?.edit_ticket?.full_access,
            deleteTicket: roleDetails?.permissions?.delete_ticket,
            viewTicketFullAccess: roleDetails?.permissions?.view_ticket?.full_access,
            addClients: roleDetails?.permissions?.add_clients,
            editClientsFullAccess: roleDetails?.permissions?.edit_clients?.full_access,
            viewClientsFullAccess: roleDetails?.permissions?.view_clients?.full_access,
            viewBroadcastedListFullAccess: roleDetails?.permissions?.view_broadcastedList,
            addRole: roleDetails?.permissions?.add_role,
            editRoleFullAccess: roleDetails?.permissions?.edit_role_full_access,
            deleteRole: roleDetails?.permissions?.delete_role,
            viewRoleFullAccess: roleDetails?.permissions?.view_role?.full_access
        })
    }

    showDialog = (open, type, msg) => {
        this.setState({
            toast: {
                open: open,
                msg: msg,
                duration: 5000,
                type: type

            }
        })

    }

    closeDialog = (open = false) => {
        this.setState({
            toast: {
                open: open,
                msg: "",
                duration: 5000,
                type: ""
            }
        })


    }

    handleChange = (e) => {
        let { name, value } = e.target
        this.setState({
            [name]: value,
        }, () => {
            console.log(this.state)
        })
    }

    handleChangeCheckBox = (e) => {
        this.setState({ is_paid: e.target.checked })

        let { name, value, checked } = e.target
        this.setState({
            [name]: checked,
        }, () => {
            console.log(this.state, "values are")
        })
    }

    handleRegister = () => {
        const { roleName,
            addCenter, updateCenterFullAccess, deleteCenter, viewCenterDetailsFullAccess, viewCenterDetailsViewPincode,
            addTechnician, updateTechnicianFullAccess, deleteTechnician, viewTechnicianDetailsFullAccess, viewTechnicianDetailsTechnicianPhone, viewDashboardFullAccess, addNewServices, updateServicesFullAccess, inActiveActive,
            viewServicesListFullAccess, addTicket, editTicketFullAccess, deleteTicket, viewTicketFullAccess, addClients, editClientsFullAccess, viewClientsFullAccess, viewBroadcastedListFullAccess, addRole, editRoleFullAccess, deleteRole, viewRoleFullAccess } = this.state;


        if (!(roleName)) {

            this.setState({
                isFormValid: true
            })

            this.showDialog(true, "error", "Please fill in all required details")
            return
        }

        this.setState({
            isRegistering: true,
        })

        let payload = {
            role_name: roleName,
            role_created_user: this.props?.reduxState?.adminDetails?._id,
            permissions: {
                //center
                add_center: addCenter,
                update_center: {
                    full_access: updateCenterFullAccess,
                },
                delete_center: deleteCenter,
                view_center_details: {
                    full_access: viewCenterDetailsFullAccess,
                    view_pincode: viewCenterDetailsViewPincode,
                },

                //technician roles
                add_technician: addTechnician,
                update_technician: {
                    full_access: updateTechnicianFullAccess,
                },
                delete_technician: deleteTechnician,
                view_technician_details: {
                    full_access: viewTechnicianDetailsFullAccess,
                    technician_phone: viewTechnicianDetailsTechnicianPhone,
                },

                //dashboard
                view_dashboard_full_access: viewDashboardFullAccess,

                //services
                add_new_services: addNewServices,
                update_services: {
                    full_access: updateServicesFullAccess,
                },
                inactive_active: inActiveActive,
                view_services_list: {
                    full_access: viewServicesListFullAccess,
                },

                //tickets
                add_ticket: addTicket,
                edit_ticket: {
                    full_access: editTicketFullAccess,
                },
                delete_ticket: deleteTicket,
                view_ticket: {
                    full_access: viewTicketFullAccess,
                },

                //clients 
                add_clients: addClients,
                edit_clients: {
                    full_access: editClientsFullAccess,
                },
                view_clients: {
                    full_access: viewClientsFullAccess,
                },

                //broadcastedList
                view_broadcastedList: viewBroadcastedListFullAccess,

                //roles
                add_role: addRole,
                edit_role_permissions: {
                    full_access: editRoleFullAccess,
                },
                delete_role: deleteRole,
                view_role: {
                    full_access: viewRoleFullAccess,
                },
            }
        };

        if (this.state.isEditDetailsExists) {

            payload.role_obj_id = this.getRoleObjIdForEdit()

            payload['role_name'] = roleName || false
            payload['permissions.add_center'] = addCenter || false
            payload['permissions.update_center.full_access'] = updateCenterFullAccess || false
            payload['permissions.delete_center'] = deleteCenter || false
            payload['permissions.view_center_details.full_access'] = viewCenterDetailsFullAccess || false
            payload['permissions.view_center_details.view_pincode'] = viewCenterDetailsViewPincode || false
            payload['permissions.add_technician'] = addTechnician || false
            payload['permissions.update_technician.full_access'] = updateTechnicianFullAccess || false
            payload['permissions.delete_technician'] = deleteTechnician || false
            payload['permissions.view_technician_details.full_access'] = viewTechnicianDetailsFullAccess || false
            payload['permissions.view_technician_details.technician_phone'] = viewTechnicianDetailsTechnicianPhone || false
            payload['permissions.view_dashboard_full_access'] = viewDashboardFullAccess || false
            payload['permissions.add_new_services'] = addNewServices || false
            payload['permissions.update_services.full_access'] = updateServicesFullAccess || false
            payload['permissions.inactive_active'] = inActiveActive || false
            payload['permissions.view_services_list.full_access'] = viewServicesListFullAccess || false
            payload['permissions.add_ticket'] = addTicket || false
            payload['permissions.edit_ticket.full_access'] = editTicketFullAccess || false
            payload['permissions.delete_ticket'] = deleteTicket || false
            payload['permissions.view_ticket.full_access'] = viewTicketFullAccess || false
            payload['permissions.add_clients'] = addClients || false
            payload['permissions.edit_clients.full_access'] = editClientsFullAccess || false
            payload['permissions.view_clients.full_access'] = viewClientsFullAccess || false
            payload['permissions.view_broadcastedList'] = viewBroadcastedListFullAccess || false
            payload['permissions.add_role'] = addRole || false
            payload['permissions.edit_role_permissions.full_access'] = editRoleFullAccess || false
            payload['permissions.delete_role'] = deleteRole || false
            payload['permissions.view_role.full_access'] = viewRoleFullAccess || false

            new AdminApiModule().adminUpdateRole(payload).then(res => {

                this.showDialog(true, "success", "Role updated successfully");

                this.setState({
                    isRegistering: false,
                })

                this.props.history.push('/roles')
            }).catch(err => {
                console.log(err)
                this.showDialog(true, "error", err?.response?.data?.message);
                this.setState({
                    isRegistering: false,
                })
            })

            return;
        }

        new AdminApiModule().adminAddRole(payload).then(res => {

            this.showDialog(true, "success", "Role Created successfully");

            this.handleResetValues()
            this.props.history.push('/roles');

        }).catch(err => {
            console.log(err)
            this.setState({
                isRegistering: false,
            })
            this.showDialog(true, "error", err?.response?.data?.message);


        })

    }


    handleResetValues() {
        this.setState({
            isRegistering: false,

            roleName: '',
            addCenter: false,
            updateCenterFullAccess: false,
            deleteCenter: false,
            viewCenterDetailsFullAccess: false,
            viewCenterDetailsViewPincode: false,
            addTechnician: false,
            updateTechnicianFullAccess: false,
            deleteTechnician: false,
            viewTechnicianDetailsFullAccess: false,
            viewTechnicianDetailsTechnicianPhone: false,
            viewDashboardFullAccess: false,
            addNewServices: false,
            updateServicesFullAccess: false,
            inActiveActive: false,
            viewServicesListFullAccess: false,
            addTicket: false,
            editTicketFullAccess: false,
            deleteTicket: false,
            viewTicketFullAccess: false,
            addClients: false,
            editClientsFullAccess: false,
            viewClientsFullAccess: false,
            viewBroadcastedListFullAccess: false,
            addRole: false,
            editRoleFullAccess: false,
            deleteRole: false,
            viewRoleFullAccess: false,
        });
    }

    render() {
        const { toast: snackBarValues, isFormValid, roleName,
            addCenter, updateCenterFullAccess, deleteCenter, viewCenterDetailsFullAccess, viewCenterDetailsViewPincode,
            addTechnician, updateTechnicianFullAccess, deleteTechnician, viewTechnicianDetailsFullAccess, viewTechnicianDetailsTechnicianPhone, viewDashboardFullAccess, addNewServices, updateServicesFullAccess, inActiveActive,
            viewServicesListFullAccess, addTicket, editTicketFullAccess, deleteTicket, viewTicketFullAccess, addClients, editClientsFullAccess, viewClientsFullAccess, viewBroadcastedListFullAccess, addRole, editRoleFullAccess, deleteRole, viewRoleFullAccess } = this.state;

        if (this.state.isEditDetailsExists && !this.state.doesRoleExists) {

            return <>
                "Page not found !!!"
            </>
        }
        return (
            <div>
                {
                    snackBarValues.open && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={snackBarValues.open} autoHideDuration={snackBarValues.duration} onClose={this.closeDialog}>
                        <Alert onClose={this.closeDialog} severity={snackBarValues.type} sx={{ width: '100%' }}>
                            {snackBarValues.msg}
                        </Alert>
                    </Snackbar>
                }
                <h2 className="text-align-center">{
                    this.state.isEditDetailsExists ? "Update Role" :
                        "Add Role"}</h2>
                <Item>
                    <Grid container  >
                        <Grid item style={stylesCss.paddingInnerGrids} md={12}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Role Name"
                                style={stylesCss.inputBox}
                                name="roleName"
                                value={roleName}
                                onChange={this.handleChange}
                                error={isFormValid && !roleName}
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="addCenter" checked={addCenter} onChange={this.handleChangeCheckBox} />} label="Add Center" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="updateCenterFullAccess" checked={updateCenterFullAccess} onChange={this.handleChangeCheckBox} />} label="Update Center Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="deleteCenter" checked={deleteCenter} onChange={this.handleChangeCheckBox} />} label="Delete Center" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewCenterDetailsFullAccess" checked={viewCenterDetailsFullAccess} onChange={this.handleChangeCheckBox} />} label="View Center Details Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewCenterDetailsViewPincode" checked={viewCenterDetailsViewPincode} onChange={this.handleChangeCheckBox} />} label="View Center Details Only Pincode" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="addTechnician" checked={addTechnician} onChange={this.handleChangeCheckBox} />} label="Add Technician" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="updateTechnicianFullAccess" checked={updateTechnicianFullAccess} onChange={this.handleChangeCheckBox} />} label="Update Technician Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="deleteTechnician" checked={deleteTechnician} onChange={this.handleChangeCheckBox} />} label="Delete Technician" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewTechnicianDetailsFullAccess" checked={viewTechnicianDetailsFullAccess} onChange={this.handleChangeCheckBox} />} label="View Technician Details Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewTechnicianDetailsTechnicianPhone" checked={viewTechnicianDetailsTechnicianPhone} onChange={this.handleChangeCheckBox} />} label="View Technician Details Technician Phone" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewDashboardFullAccess" checked={viewDashboardFullAccess} onChange={this.handleChangeCheckBox} />} label="View Dashboard Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="addNewServices" checked={addNewServices} onChange={this.handleChangeCheckBox} />} label="Add New Services" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="updateServicesFullAccess" checked={updateServicesFullAccess} onChange={this.handleChangeCheckBox} />} label="Update Services Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="inActiveActive" checked={inActiveActive} onChange={this.handleChangeCheckBox} />} label="InActive Active" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewServicesListFullAccess" checked={viewServicesListFullAccess} onChange={this.handleChangeCheckBox} />} label="View Services List Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="addTicket" checked={addTicket} onChange={this.handleChangeCheckBox} />} label="Add Ticket" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="editTicketFullAccess" checked={editTicketFullAccess} onChange={this.handleChangeCheckBox} />} label="Edit Ticket Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="deleteTicket" checked={deleteTicket} onChange={this.handleChangeCheckBox} />} label="Delete Ticket" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewTicketFullAccess" checked={viewTicketFullAccess} onChange={this.handleChangeCheckBox} />} label="View Ticket Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="addClients" checked={addClients} onChange={this.handleChangeCheckBox} />} label="Add Clients" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="editClientsFullAccess" checked={editClientsFullAccess} onChange={this.handleChangeCheckBox} />} label="Edit Clients Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewClientsFullAccess" checked={viewClientsFullAccess} onChange={this.handleChangeCheckBox} />} label="View Clients Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewBroadcastedListFullAccess" checked={viewBroadcastedListFullAccess} onChange={this.handleChangeCheckBox} />} label="View Broadcasted List Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="addRole" checked={addRole} onChange={this.handleChangeCheckBox} />} label="Add Role" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="editRoleFullAccess" checked={editRoleFullAccess} onChange={this.handleChangeCheckBox} />} label="Edit Role Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="deleteRole" checked={deleteRole} onChange={this.handleChangeCheckBox} />} label="Delete Role" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormGroup>
                                <FormControlLabel control={<Switch name="viewRoleFullAccess" checked={viewRoleFullAccess} onChange={this.handleChangeCheckBox} />} label="View Role Full Access" />
                            </FormGroup>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <Button
                                variant="contained"
                                onClick={() => this.handleRegister()}
                                disabled={this.state.isRegistering}
                            >{this.state.isEditDetailsExists ? "Update " : "Save"}
                            </Button>
                        </Grid>
                    </Grid >
                </Item>
            </div>
        );
    }
}

// export default withRouter(AddRole);
const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})

export default connect(mapStateToProps, null)(withRouter(AddRole));