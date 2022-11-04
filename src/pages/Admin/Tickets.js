import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../../Styles/style.css';
import AdminApiModule from '../../components/AdminApi/Api/api';
import { Button } from '@mui/material';
import TicketEditPincodePopup from '../../components/AdminApi/ticketEditPincodePopup'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import BasicDateRangePicker from '../../components/common/datepicker'
import { withRouter } from "react-router";
import moment from 'moment'
import { connect } from 'react-redux';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FileUploadErrors from '../../components/FileUploadErrors';

const Input = styled('input')({
    display: 'none',
});

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

const options = {
    filterType: 'dropdown',
};

class Tickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketsList: [],
            columns: [
                {
                    name: "Created_at",
                    label: "Created on",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "ticket_id",
                    label: "Ticket Id",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "center_id",
                    label: "Assigned Center",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "technician_id",
                    label: "Assigned technician",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "service_required",
                    label: "Service Required",
                    options: {
                        filter: true,
                        sort: false,
                    }
                }, {
                    name: "specific_requirements",
                    label: "Specific  Requirements",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "name",
                    label: "Name",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "phone",
                    label: "Phone",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "address",
                    label: "Address",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "pincode",
                    label: "Pincode",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "createdAt",
                    label: "Created At",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "bstatus",
                    label: "Broadcast status",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "tstatus",
                    label: "Ticket status",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "tcreatedby",
                    label: "ticket created by",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "action",
                    label: "Actions",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log({
                                value, tableMeta, updateValue
                            })
                            return <>
                                {
                                    value.broadcast_status == "no_match_found" ? <>
                                        <Button style={{ marginRight: "10px" }} onClick={() => this.handleOpenEditPincodePopup(value)} variant="contained" >Edit Pincode</Button>

                                        <Button variant="contained" onClick={() => this.handleBroadCastTicket(value)}  >BroadCast</Button>

                                    </> : ""
                                }
                                <Button variant="contained" onClick={() => this.handleViewTicket(value?._id)}  >View Ticket</Button>
                                <Button variant="contained" onClick={() => this.handleEditTicket(value?._id)}  >Edit Ticket</Button>

                            </>
                        }
                    }
                },
            ],
            isEditOpenAddressPincode: false,
            isEditOpenTicketDetails: {},
            isPincodeUpdating: false,

            isLoading: false,

            doesFileUploadErrorExists: false,
            errorsList: {}
        };
    }

    handleEditTicket = (id) => {
        this.props.history.push('/admin-ticket?edit=' + id)

    }

    handleViewTicket = (id) => {
        this.props.history.push('/view-ticket?ticketId=' + id)

    }


    onClickFilter = (value) => {
        this.startLoading()

        let payload = {
            start_date: value[0],
            end_date: value[1]
        }

        new AdminApiModule().getAllTickets(payload).then(res => {
            let parsedData = [];
            if (res?.data?.length) {
                parsedData = this.getParsedData(res.data);
            }
            this.setState({
                ticketsList: parsedData
            })

            this.stopLoading()
        }).catch(err => {
            this.stopLoading()

            console.log(err)
        })
    }

    startLoading = () => {
        this.setState({ isLoading: true });
    }

    stopLoading = () => {
        this.setState({ isLoading: false });
    }

    handleBroadCastTicket = (value) => {
        let payload = {
            ticket_obj_id: value?._id

        }
        new AdminApiModule().adminBroadCast(payload).then(res => {
            this.getAllTickets();

        }).catch(err => {
            console.log(err)
        })

    }

    handleOpenEditPincodePopup = (value) => {
        this.setState({
            isEditOpenAddressPincode: true,
            isEditOpenTicketDetails: value
        })
    }

    handleCloseEditPincodePopup = () => {
        this.setState({
            isEditOpenAddressPincode: false,
            isEditOpenTicketDetails: {}
        })
    }


    componentDidMount = () => {
        this.getAllTickets();
    }

    getFormattedAddress = (addressObject) => {
        let addressLine = addressObject?.house_number + ', ' + addressObject?.locality + ', ' +
            addressObject?.city + ', ' + addressObject?.state;
        return addressLine;
    }

    getParsedData = (data) => {
        let parsedData = data?.map((item) => {
            return {
                Created_at: moment(item?.createdAt).format(
                    'Do MMM, hh:ss A',
                ),
                ticket_id: item?.ticket_id || '-',
                center_id: item?.assigned_ids?.assigned_center_id?.center_name,
                technician_id: item?.assigned_ids?.assigned_technician_id?.personal_details?.name,
                service_required: item?.service_provided_for?.service_name,
                name: item.personal_details.name,
                phone: item.personal_details.primary_phone.mobile_number,
                address: this.getFormattedAddress(item?.address_details),
                pincode: item.address_details.pincode,
                createdAt: new Date(item?.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }),
                specific_requirements: item?.specific_requirement ? item?.specific_requirement : "-",
                bstatus: item?.broadcast_status,
                tstatus: item?.ticket_status,
                tcreatedby: item?.ticket_created_by,
                action: item
            }
        });

        return parsedData;
    }

    getAllTickets() {

        this.startLoading()

        new AdminApiModule().getAllTickets().then(res => {
            let parsedData = [];
            if (res?.data?.length) {
                parsedData = this.getParsedData(res.data);
            }
            this.setState({
                ticketsList: parsedData
            })

            this.stopLoading()
        }).catch(err => {
            this.stopLoading()

            console.log(err)
        })
    }

    handleUpdatePincode = (newPincode) => {
        if (!newPincode) {
            return
        }
        let payload = {
            address_details: {
                pincode: newPincode
            },
            ticket_obj_id: this.state.isEditOpenTicketDetails?._id

        }

        this.setState({ isPincodeUpdating: true })
        new AdminApiModule().updatePincode(payload).then(res => {
            this.setState({ isPincodeUpdating: false })
            this.getAllTickets();
            this.handleCloseEditPincodePopup()
        }).catch(err => {
            this.setState({ isPincodeUpdating: false })
        })

    }

    onUploadCsvFile = (event, stateValue) => {
        let files = event.target.files;
        let aadharSideName = event.target.name;
        let fileOriginalName = files[0]?.name?.split('.')[0];
        console.log('files', files, aadharSideName, fileOriginalName, typeof (fileOriginalName));

        const formData = new FormData();

        formData.append(
            "ticketsCsvFile",
            files[0],
            fileOriginalName
        );

        new AdminApiModule().uploadTicketsCsv(formData).then(res => {
            console.log("res is", res);
            if(res && res.data && res.data.doesErrorExists){
                this.setState({ doesFileUploadErrorExists: true, errorsList: res.data.errorRowWise });

            } else {
                this.getAllTickets();
            }
            // this.setState({ [stateValue]: res.data?.fileSavedUrl }, () => {
            //     console.log(this.state, "sssssss", stateValue)
            // });
        }).catch(err => {
            console.log(err)
        })
    }

    handleCloseFileUploadErrors = () => {
        this.setState({ doesFileUploadErrorExists: false, errorsList: {} })
    }

    render() {
        return (
            <div>
                {this.state.isEditOpenAddressPincode && <TicketEditPincodePopup
                    open={this.state.isEditOpenAddressPincode}
                    isPincodeUpdating={this.state.isPincodeUpdating}
                    handleUpdatePincode={this.handleUpdatePincode}
                    handleClose={this.handleCloseEditPincodePopup}
                    isEditOpenTicketDetails={this.state.isEditOpenTicketDetails}
                />}

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={this.state.isLoading}
                    onClick={this.stopLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>



                {
                    this.props.reduxState?.adminDetails?.role_id?.permissions?.view_ticket?.full_access ? <>


                        <Grid container  >
                            <Grid item style={stylesCss.paddingInnerGrids} md={6}>

                                <BasicDateRangePicker
                                    onClickFilter={this.onClickFilter}
                                    refreshData={this.getAllTickets}
                                />
                            </Grid>

                            <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                                <div className="aadhar-upload-button">
                                    <div>
                                        <label htmlFor="contained-button-file">
                                            <Input name="ticketsCsvFile"
                                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                id="contained-button-file" type="file" onChange={(e) => this.onUploadCsvFile(e)} />
                                            <Button variant="contained" component="span">
                                                Upload Tickets File
                                            </Button>
                                        </label>
                                        <div>
                                            <div>Upload csv file for tickets</div>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>

                        <MUIDataTable
                            title={"Tickets"}
                            data={this.state.ticketsList}
                            columns={this.state.columns}
                            options={options}
                        />
                        
                        {this.state.doesFileUploadErrorExists &&
                            <FileUploadErrors doesFileUploadErrorExists={this.state.doesFileUploadErrorExists}
                                errorsList={this.state.errorsList}
                                handleCloseFileUploadErrors={this.handleCloseFileUploadErrors}
                            />
                        }

                    </> : "No permission , contact admin"
                }

            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})


export default connect(mapStateToProps, null)(withRouter(Tickets));