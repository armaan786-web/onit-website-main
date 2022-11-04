import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../Styles/style.css';
import CenterApi from '../components/centerComponent/api/api'
import { Button } from '@material-ui/core';

import AssignTechnicianPopup from '../components/centerComponent/assignTechnicianPopup'
import CloseTicketRemarksModal from '../components/Components/CloseTicketRemark';
import AddRemarksPopup from '../components/Components/AddRemarksPopup';

import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'

const options = {
    filterType: 'dropdown',
    download: false,
    print: false
};

class Tickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketsList: [],
            columns: [
                {
                    name: "center_id",
                    label: "Center Id",
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
                    name: "ticketStatus",
                    label: "ticketStatus",
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
                    name: "action",
                    label: "Actions",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log({
                                value, tableMeta, updateValue
                            })
                            return <>
                                {
                                    value?.is_technician_assigned && value?.ticket_status !== "CLOSED" ? <>
                                        <Button onClick={() => this.clickCloseTicket(value?._id)} variant="contained" color="primary" >Close Ticket</Button>

                                        <Button variant="contained" onClick={() => {
                                            this.handleOpenTechnicianPopup(value, true)
                                        }}>Assign new Technician</Button>

                                    </> : ""
                                }
                                {
                                    !value?.is_technician_assigned ? <>
                                        <Button variant="contained" onClick={() => {
                                            this.handleOpenTechnicianPopup(value, false)
                                        }}>Assign Technician</Button>
                                    </> : ""
                                }

                                {/* <Button onClick={() => this.openAddRemarksPopup(value?._id)} variant="contained" color="primary" >Add Remarks</Button> */}

                            </>
                        }
                    }
                },
                {
                    name: "remarks",
                    label: "Remarks",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log({
                                value, tableMeta, updateValue
                            })
                            return <>

                                {value?.ticket_status !== "CLOSED" ? <>
                                    <Button onClick={() => this.openAddRemarksPopup(value)} variant="contained" color="primary" >Add Remarks</Button>


                                </> : ""}
                            </>
                        }
                    }
                },
            ],
            isAssignTechnicianPopupOpen: false,
            ticketDetailsForAssignTechnician: {},
            isTechnicianAssigning: false,
            technicianList: [],
            isCloseTicketRemarksModalOpen: false,
            closingTicketId: '',
            isForChange: false,

            ticketObj: {},
            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
        };
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

    handleOpenTechnicianPopup = (ticketDetails, isForChangeValue) => {
        this.setState({
            isAssignTechnicianPopupOpen: true,
            ticketDetailsForAssignTechnician: ticketDetails,
            isForChange: isForChangeValue
        })
    }

    handleCloseAssignTechnicianPopup = () => {
        this.setState({
            isAssignTechnicianPopupOpen: false,
            ticketDetailsForAssignTechnician: {}
        })

    }

    handleOpenCloseTicketRemarksModal = () => {
        this.setState({
            isCloseTicketRemarksModalOpen: true,
        })
    }

    handleCloseCloseTicketRemarksModal = () => {
        this.setState({
            isCloseTicketRemarksModalOpen: false,
        })

    }

    handleCloseTicket = (closingTicketRemarks, amount) => {

        if (!(amount == 0 || amount)) {
            return
        }

        if (this.state.closingTicketId && this.state.closingTicketId.length > 0) {

            let payload = {
                ticket_obj_id: this.state.closingTicketId,
                remarks: {
                    close_ticket_remarks: closingTicketRemarks
                },
                amount
            }

            console.log('payload is', payload);

            new CenterApi().closeTicket(payload).then(res => {
                this.setState({ closingTicketId: '' });
                this.handleCloseCloseTicketRemarksModal();
                this.showDialog(true, "success", "Ticket closed successfully");

                this.getAllTickets();
            }).catch(err => {
                console.log(err)
                this.showDialog(true, "error", err?.response?.data?.message);
            })
        }



    }

    clickCloseTicket = (ticket_obj_id) => {
        this.setState({ closingTicketId: ticket_obj_id });
        this.handleOpenCloseTicketRemarksModal(ticket_obj_id);
    }

    openAddRemarksPopup = (ticketObj) => {
        this.setState({ ticketObj: ticketObj });
        this.setState({ isOpenAddRemarksPopup: true });
    }

    closeAddRemarksPopup = () => {
        this.setState({ isOpenAddRemarksPopup: false });
    }

    componentDidMount() {
        this.getAllTickets();
        this.getAllTechnician()
    }

    getAllTechnician = () => {
        new CenterApi().getAllTechnician().then(res => {
            this.setState({
                technicianList: res?.data
            })
        }).catch(err => {
            console.log(err)
        })

    }

    handleAssignTechnician = (technician_obj_id) => {
        if (!technician_obj_id) {
            return;
        }

        this.setState({ isTechnicianAssigning: true })
        let payload = {
            ticket_obj_id: this.state.ticketDetailsForAssignTechnician._id,
            technician_obj_id: technician_obj_id

        }

        new CenterApi().assignTechnician(payload).then(res => {
            this.handleCloseAssignTechnicianPopup()
            this.setState({ isTechnicianAssigning: false })
            this.getAllTickets();

        }).catch(err => {
            this.setState({ isTechnicianAssigning: false })

            console.log(err)
        })


    }

    handleChangeTechnician = (technician_obj_id) => {
        if (!technician_obj_id) {
            return;
        }

        this.setState({ isTechnicianAssigning: true })
        let payload = {
            ticket_obj_id: this.state.ticketDetailsForAssignTechnician._id,
            technician_obj_id: technician_obj_id

        }

        new CenterApi().changeTechnician(payload).then(res => {
            this.handleCloseAssignTechnicianPopup()
            this.setState({ isTechnicianAssigning: false })
            this.getAllTickets();

        }).catch(err => {
            this.setState({ isTechnicianAssigning: false })

            console.log(err)
        })


    }

    getFormattedAddress = (addressObject) => {
        let addressLine = addressObject?.house_number + ', ' + addressObject?.locality + ', ' +
            addressObject?.city + ', ' + addressObject?.state;
        return addressLine;
    }

    getParsedData = (data) => {
        let parsedData = data?.map((item) => {
            return {
                center_id: item?.assigned_ids?.assigned_center_id?.qr_details?.qr_id ?? '-',
                service_required: item?.service_provided_for?.service_name,
                name: item?.personal_details?.name,
                phone: item?.personal_details?.primary_phone?.mobile_number,
                address: this.getFormattedAddress(item?.address_details),
                pincode: item?.address_details?.pincode,
                createdAt: new Date(item?.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }),
                ticketStatus: item?.ticket_status,
                action: item,
                remarks: item

            }
        });

        return parsedData;
    }

    getAllTickets() {
        new CenterApi().getAllTickets().then(res => {
            let parsedData = [];
            if (res?.data?.length) {
                parsedData = this.getParsedData(res.data);
            }
            console.log(parsedData, "parsedData")

            this.setState({
                ticketsList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        const { toast: snackBarValues } = this.state

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

                {this.state.isAssignTechnicianPopupOpen &&
                    <AssignTechnicianPopup
                        open={this.state.isAssignTechnicianPopupOpen}
                        handleClose={this.handleCloseAssignTechnicianPopup}
                        technicianList={this.state.technicianList}
                        isForChange={this.state.isForChange}
                        handleAssignTechnician={this.handleAssignTechnician}
                        handleChangeTechnician={this.handleChangeTechnician}
                        isTechnicianAssigning={this.state.isTechnicianAssigning}
                    />}



                <MUIDataTable
                    title={"Tickets"}
                    data={this.state.ticketsList}
                    columns={this.state.columns}
                    options={options}
                />

                {this.state.isCloseTicketRemarksModalOpen &&
                    <CloseTicketRemarksModal
                        open={this.state.isCloseTicketRemarksModalOpen}
                        handleClose={this.handleCloseCloseTicketRemarksModal}
                        handleCloseTicket={this.handleCloseTicket}
                    />}

                {this.state.isOpenAddRemarksPopup && this.state.ticketObj &&
                    <AddRemarksPopup
                        open={this.state.isOpenAddRemarksPopup}
                        ticketObj={this.state.ticketObj}
                        handleClose={this.closeAddRemarksPopup}
                    />
                }
            </div>
        );
    }
}

export default Tickets;