import React, { Component } from 'react'

import '../../../Styles/style.css';
import CenterOnboardApi from '../../../components/CenterOnboardApi/Api/api';
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

const dateFormat = { year: "numeric", month: "short", day: "numeric" };

class CenterOnboardCenters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            centersList: [],
            isCenterEdit: false,

            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
        };
    }

    componentDidMount = () => {
        this.OnboarderGetAllCenters();
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

    getFormattedList = (element) => {
        console.log(element)
        let result = [];
        element && element.length > 0 && element.map((item) => {
            result.push(item);
        })
        return result.length > 0 ? result.join(", ") : "";
    }

    OnboarderGetAllCenters() {
        new CenterOnboardApi().OnboarderGetAllCenters().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.length > 0) {
                parsedData = res.data;
            }
            this.setState({
                centersList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handleAddCenter = () => {
        this.props.history.push('/center-onboard-add-center');
    }


    handleClose = () => {
        this.setState({ isCenterEdit: false });
    };

    handleDeleteCenter = (id) => {
        let payload = {
            user_object_id: id
        }
        new CenterOnboardApi().adminRemoveUser(payload).then(res => {
            if (res) {
                this.showDialog(true, "success", 'Center deleted successfully')
            }
            this.OnboarderGetAllCenters();
        }).catch(err => {
            console.log(err)
            this.showDialog(true, "error", err?.response?.data?.message)
        })
    }

    getFormattedServices = (services) => {
        let secondary_services_list = [];
        services && services.length > 0 && services.map((item) => {
          secondary_services_list.push(item?.secondary_services_id?.service_name);
        })
        return secondary_services_list.length > 0 ? secondary_services_list.join(", ") : "";
      }
    
      getFormattedClients = (clients) => {
        let clients_list = [];
        clients && clients.length > 0 && clients.map((item) => {
          clients_list.push(item.client_name);
        })
        return clients_list.length > 0 ? clients_list.join(", ") : "";
      }

    render() {
        const { centersList } = this.state;
        return (
            <div>
                <div className='add-service-button'>
                    <Button variant="contained" className='text-transform-none' onClick={this.handleAddCenter}>
                        Add a Center
                    </Button>
                </div>

                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Center Name</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>QR Code</TableCell>
                                    <TableCell>Primary Pincode</TableCell>
                                    <TableCell>Secondary Pincode</TableCell>
                                    <TableCell>Primary Skill</TableCell>
                                    <TableCell>Secondary Skill</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Authorized For Clients</TableCell>
                                    <TableCell>Total ticket closed</TableCell>

                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {console.log("centersList is", centersList)}
                                {centersList && centersList.length > 0 && centersList.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.center_name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.personal_details?.phone?.country_code + row?.personal_details?.phone?.mobile_number}
                                        </TableCell>
                                        {/* <TableCell component="th" scope="row">
                                            {this.getFormattedList(row?.allowed_pincodes)}
                                        </TableCell> */}
                                        <TableCell component="th" scope="row">
                                            {row?.qr_details?.qr_id}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.address_details?.pincode}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.address_details?.additional_pincode}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.services?.primary_services?.service_name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {this?.getFormattedServices(row?.services?.secondary_services)}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.is_active}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {new Date(row?.createdAt)?.toLocaleDateString("en-US", dateFormat)}
                                        </TableCell><TableCell component="th" scope="row">
                                            {this.getFormattedClients(row?.clients_ids_list)}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.count_details?.closed_ticket_count}
                                        </TableCell>
                                        {/* <TableCell component="th" scope="row">
                                            <Button variant="outlined" onClick={() => this.handleDeleteCenter(row._id)}>
                                                Delete User
                                            </Button>
                                        </TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

        );
    }
}

export default withRouter(CenterOnboardCenters);