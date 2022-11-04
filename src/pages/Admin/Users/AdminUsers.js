import React, { Component } from 'react'

import '../../../Styles/style.css';
import AdminApiModule from '../../../components/AdminApi/Api/api';
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
import ViewUser from './ViewUser';

class AdminUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersList: [],
            isUserEdit: false,

            viewfeedback: [],
            isViewUserOpen: false,
            selectedUser: {},

            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
        };
    }

    parseUserObject = (userObject) => {
        let resultObject = {
            userName: userObject?.user_name,
            password: userObject?.password,
            phoneNumber: userObject?.phone?.mobile_number,
            roleName: userObject?.role_id.role_name,
           
        };
        return resultObject;
    }

    handleViewUser = (userObject) => {
        let userObjectValue = this.parseUserObject(userObject);
        console.log("userObjectValue is", userObjectValue);
        this.setState({ isViewUserOpen: true, selectedUser: userObjectValue });
    }

    handleCloseViewUser = () => {
        this.setState({ isViewUserOpen: false });
    }

    componentDidMount = () => {
        this.getAllUsers();
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

    getFormattedServices = (services) => {
        console.log(services)
        let secondary_services_list = [];
        services && services.length > 0 && services.map((item) => {
            secondary_services_list.push(item.secondary_services_id.service_name);
        })
        return secondary_services_list.length > 0 ? secondary_services_list.join(", ") : "";
    }

    getAllUsers() {
        new AdminApiModule().getAllUsers().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.allUsers && res.data.allUsers.length > 0) {
                parsedData = res.data.allUsers;
            }
            this.setState({
                usersList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handleAddUser = () => {
        this.props.history.push('/add-user');
    }


    handleClose = () => {
        this.setState({ isUserEdit: false });
    };

    handleDeleteUser = (id) => {
        let payload = {
            user_object_id: id
        }
        new AdminApiModule().adminRemoveUser(payload).then(res => {
            if (res) {
                this.showDialog(true, "success", 'User deleted successfully')
            }
            this.getAllUsers();
        }).catch(err => {
            console.log(err)
            this.showDialog(true, "error", err?.response?.data?.message)
        })
    }

    render() {
        const { usersList } = this.state;
        return (
            <div>
                <div className='add-service-button'>
                    <Button variant="contained" className='text-transform-none' onClick={this.handleAddUser}>
                        Add a User
                    </Button>
                </div>

                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>User Name</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Role Given</TableCell>

                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {console.log("usersList is", usersList)}
                                {usersList && usersList.length > 0 && usersList.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.user_name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.phone.country_code + row.phone.mobile_number}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.role_id?.role_name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Button variant="outlined" onClick={() => this.handleDeleteUser(row._id)}>
                                                Delete User
                                            </Button>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Button variant="outlined" onClick={() => this.handleViewUser(row)}>
                                                View User
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div>
                    <ViewUser isViewUserOpen={this.state.isViewUserOpen}
                        handleCloseViewUser={this.handleCloseViewUser}
                        userObject={this.state.selectedUser}
                    />
                </div>
            </div>

        );
    }
}

export default withRouter(AdminUsers);
