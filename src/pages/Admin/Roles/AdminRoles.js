import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../../../Styles/style.css';
import AdminApiModule from '../../../components/AdminApi/Api/api';
import ViewFeedBackPOpup from '../../../components/Components/ViewFeedBackPopup'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { withRouter } from "react-router";
import ViewRole from './ViewRole';
import { connect } from 'react-redux';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rolesList: [],
            isRoleEdit: false,

            viewfeedback: [],
            isOpenFeedBackPopup: false,
            isViewRoleOpen: false,
            selectedRole: {}
        };
    }

    parseRoleObject = (roleObject) => {
        let resultObject = {
            // roleName: roleObject?.role_name,
            addCenter: roleObject?.permissions?.add_center,
            updateCenterFullAccess: roleObject?.permissions?.update_center?.full_access,
            deleteCenter: roleObject?.permissions?.delete_center,
            viewCenterDetailsFullAccess: roleObject?.permissions?.view_center_details?.full_access,
            viewCenterDetailsViewPincode: roleObject?.permissions?.view_center_details?.view_pincode,
            addTechnician: roleObject?.permissions?.add_technician,
            updateTechnicianFullAccess: roleObject?.permissions?.update_technician?.full_access,
            deleteTechnician: roleObject?.permissions?.delete_technician,
            viewTechnicianDetailsFullAccess: roleObject?.permissions?.view_technician_details?.full_access,
            viewTechnicianDetailsTechnicianPhone: roleObject?.permissions?.view_technician_details?.technician_phone,
            viewDashboardFullAccess: roleObject?.permissions?.view_dashboard_full_access,
            addNewServices: roleObject?.permissions?.add_new_services,
            updateServicesFullAccess: roleObject?.permissions?.update_services?.full_access,
            inActiveActive: roleObject?.permissions?.inactive_active,
            viewServicesListFullAccess: roleObject?.permissions?.view_services_list?.full_access,
            addTicket: roleObject?.permissions?.add_ticket,
            editTicketFullAccess: roleObject?.permissions?.edit_ticket?.full_access,
            deleteTicket: roleObject?.permissions?.delete_ticket,
            viewTicketFullAccess: roleObject?.permissions?.view_ticket?.full_access,
            addClients: roleObject?.permissions?.add_clients,
            editClientsFullAccess: roleObject?.permissions?.edit_clients?.full_access,
            viewClientsFullAccess: roleObject?.permissions?.view_clients?.full_access,
            viewBroadcastedListFullAccess: roleObject?.permissions?.view_broadcastedList,
            addRole: roleObject?.permissions?.add_role,
            editRoleFullAccess: roleObject?.permissions?.edit_role_permissions?.full_access,
            deleteRole: roleObject?.permissions?.delete_role,
            viewRoleFullAccess: roleObject?.permissions?.view_role?.full_access
        };
        return resultObject;
    }

    handleViewRole = (roleObject) => {
        let roleObjectValue = this.parseRoleObject(roleObject);
        console.log("roleObjectValue is", roleObjectValue);
        this.setState({ isViewRoleOpen: true, selectedRole: roleObjectValue });
    }

    handleCloseViewRole = () => {
        this.setState({ isViewRoleOpen: false });
    }

    toggleOpenFeedBackPopup = (viewfeedback) => {
        this.setState({ isOpenFeedBackPopup: true, viewfeedback })
    }

    toggleCloseFeedBackPopup = () => {
        this.setState({ isOpenFeedBackPopup: false, viewfeedback: [] })
    }

    componentDidMount = () => {
        this.getAllAvailableRoles();
    }

    getFormattedServices = (services) => {
        console.log(services)
        let secondary_services_list = [];
        services && services.length > 0 && services.map((item) => {
            secondary_services_list.push(item.secondary_services_id.service_name);
        })
        return secondary_services_list.length > 0 ? secondary_services_list.join(", ") : "";
    }

    getParsedData = (data) => {
        let parsedData = data && data.length > 0 && data.map((item) => {
            return {
                center_id: item.center_obj_id?.qr_details?.qr_id,
                center_name: item.center_obj_id?.center_name,
                ticket_id: item?.ticket_obj_id?._id,
                technicianName: item?.ticket_obj_id?.assigned_ids?.assigned_technician_id?.personal_details?.name,
                technicianPhone: item?.ticket_obj_id?.assigned_ids?.assigned_technician_id?.personal_details?.phone?.mobile_number,
                Address: item?.ticket_obj_id?.address_details?.house_number + " " + item?.ticket_obj_id?.address_details?.locality + " " + item?.ticket_obj_id?.address_details?.city + " " + item?.ticket_obj_id?.address_details?.state + " " + item?.ticket_obj_id?.address_details?.country,
                customer_name: item?.ticket_obj_id?.personal_details?.name,
                customer_number: item?.ticket_obj_id?.personal_details?.alternate_phone?.mobile_number,
                FeedBack: JSON.stringify(item?.feedBackResponse),
                viewfeedback: item?.feedBackResponse,
                over_all_rating: item?.over_all_rating,
                is_aldready_submitted: item?.is_aldready_submitted ? "Yes" : "No",
                View_ticket: item?.ticket_obj_id?._id,
            }
        });

        return parsedData;
    }

    getAllAvailableRoles() {
        new AdminApiModule().getAllAvailableRoles().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.length > 0) {
                parsedData = res.data;
            }
            this.setState({
                rolesList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handleAddRole = () => {
        this.props.history.push('/add-role');
    }


    handleClose = () => {
        this.setState({ isRoleEdit: false });
    };

    handleEditRole = (id) => {
        this.props.history.push('/add-role?edit=' + id)
    }

    render() {
        const { rolesList } = this.state;
        return (
            <div>
                <div className='add-service-button'>
                    {
                        this.props.reduxState?.adminDetails?.role_id?.permissions?.add_role &&  <Button variant="contained" className='text-transform-none' onClick={this.handleAddRole}>
                        Add a Role
                    </Button>
                    }
                   
                </div>

                <div>

                    {
                        this.props.reduxState?.adminDetails?.role_id?.permissions?.view_role?.full_access ? <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Role Name</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rolesList && rolesList.length > 0 && rolesList.map((row) => (
                                            <TableRow
                                                key={row._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.role_name}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button variant="outlined" onClick={() => this.handleEditRole(row._id)}>
                                                        Edit Role
                                                    </Button>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button variant="outlined" onClick={() => this.handleViewRole(row)}>
                                                        View Role
                                                    </Button>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </> : "No access to view role , contact admin"
                    }
                </div>

                <div>
                    <ViewRole isViewRoleOpen={this.state.isViewRoleOpen}
                        handleCloseViewRole={this.handleCloseViewRole}
                        roleObject={this.state.selectedRole}
                    />
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})


export default connect(mapStateToProps, null)(withRouter(Roles));

