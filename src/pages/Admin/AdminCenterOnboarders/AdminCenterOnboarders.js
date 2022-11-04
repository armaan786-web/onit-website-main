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

class AdminCenterOnboarders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            centerOnboardersList: [],
            isCenterOnboarderEdit: false,

            viewfeedback: [],
            isViewCenterOnboarderOpen: false,
            selectedCenterOnboarder: {},

            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
        };
    }

    componentDidMount = () => {
        this.getAllCenterOnBoarders();
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

    getFormattedList = (array) => {
        let result = [];
        array && array.length > 0 && array.map((item) => {
            result.push(item);
        })
        return result.length > 0 ? result.join(", ") : "";
    }

    getAllCenterOnBoarders() {
        new AdminApiModule().getAllCenterOnBoarder().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.length > 0) {
                parsedData = res.data;
            }
            this.setState({
                centerOnboardersList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handleAddCenterOnboarder = () => {
        this.props.history.push('/admin-add-center-onboarder');
    }


    handleClose = () => {
        this.setState({ isCenterOnboarderEdit: false });
    };

    handleUpdateOnboarder = (id) => {
        this.props.history.push('/admin-add-center-onboarder?edit=' + id)
    }

    render() {
        const { centerOnboardersList } = this.state;
        return (
            <div>
                <div className='add-service-button'>
                    <Button variant="contained" className='text-transform-none' onClick={this.handleAddCenterOnboarder}>
                        Add a Center Onboarder
                    </Button>
                </div>

                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Center Onboarder Id</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Primary Services</TableCell>
                                    <TableCell>Allowed States</TableCell>
                                    <TableCell>Allowed Cities</TableCell>


                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {centerOnboardersList && centerOnboardersList.length > 0 && centerOnboardersList.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.center_onboarder_id || '-'}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.phone_details.country_code + row.phone_details.mobile_number}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.services?.primary_services?.service_name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {this.getFormattedList(row?.allowed_states)}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {this.getFormattedList(row?.allowed_cities)}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Button variant="outlined" onClick={() => this.handleUpdateOnboarder(row._id)}>
                                                Edit Onboarder
                                            </Button>
                                        </TableCell>

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

export default withRouter(AdminCenterOnboarders);
