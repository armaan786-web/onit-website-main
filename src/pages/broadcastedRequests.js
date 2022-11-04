import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../Styles/style.css';

import TechnicianApi from '../components/technicianComponent/api/api'
import BroadCastApi from '../components/broadCastCenter/api/api'
import { RAZORPAY_KEY, PAYMENT_NAME, PAYMENT_DESCRIPTION } from "../components/config/config";
import { Alert, InputAdornment, Snackbar } from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const options = {
    filterType: 'dropdown',
    download: false,
    print: false
};

class Technicians extends Component {
    constructor(props) {
        super(props);
        this.state = {
            broadCastList: [],
            columns: [
                {
                    name: "date_created",
                    label: "Date Created",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "Service",
                    label: "Service",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "specific_requirement",
                    label: "Specific requirement",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "address_details",
                    label: "Address Details",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "status_of_ticket",
                    label: "Status of Ticket",
                    options: {
                        filter: true,
                        sort: false,
                    }
                }, {
                    name: "personal_details",
                    label: "Customer Name",
                    options: {
                        filter: true,
                        sort: false,
                    }
                }, {
                    name: "Action",
                    label: "Action",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log({
                                value, tableMeta, updateValue
                            })
                            return <>
                                {
                                    value.status_of_ticket == "PENDING" ? <>
                                        <button onClick={() => this.acceptTicket(value._id, value?.ticket_obj_id?.admin_setting?.is_paid)}>{value?.ticket_obj_id?.admin_setting?.is_paid ? "Accept with payment" : "Accept"}</button>
                                        <button onClick={() => this.rejectTicket(value._id)}>Reject</button>
                                    </> : ""
                                }

                            </>
                        }
                    }
                }
            ],
            snackBarValues: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""
            },
            is_loading: false,
        };
    }

    async acceptFreeTicketWithoutPayment(broadCastId) {
        this.startLoading()

        let body = {
            broadcast_obj_id: broadCastId
        }
        await new BroadCastApi().acceptBroadCastWithoutPayment(body).then(res => {
            this.getAllBroadCastTicket()
            this.stopLoading()
        }).catch(err => {
            this.stopLoading()
            console.log(err, "err")
            this.showDialog(true, "error", err?.response?.data?.message)
        })

    }


    async acceptTicket(value, is_paid) {

        if (!is_paid) {
            this.acceptFreeTicketWithoutPayment(value)
            return
        }

        console.log(value, "acceptTicket");
        let body = {
            broadcast_obj_id: value
        }
        this.startLoading()
        await new BroadCastApi().acceptBroadCast(body).then(async res => {

            this.stopLoading()
            const razorPayOptions = {
                key: RAZORPAY_KEY,
                amount: res.data.payment_response.amount, //  = INR 1
                name: PAYMENT_NAME,
                description: PAYMENT_DESCRIPTION,
                order_id: res.data.payment_response.id,
                image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
                handler: async function (response) {
                    console.log("response: ", response);
                    // let razorpay_payment_id = response.razorpay_payment_id
                    // let razorpay_order_id = response.razorpay_order_id
                    // let razorpay_signature = response.razorpay_signature

                    await new BroadCastApi().acceptTicketAfterPayment(response).then(responseAfterPayment => {
                        alert("Payment success")
                        window.reload()
                    }).catch(err => {
                        console.log(err)
                    })
                },
                prefill: {
                    name: res.centerDetails?.center_name,
                    contact: res.centerDetails?.personal_details?.phone?.mobile_number,
                    email: "demo@demo.com"
                },
                notes: {
                    address: res.centerDetails?.address_details?.address_line
                },
                theme: {
                    color: "#F37254",
                    hide_topbar: false
                }
            };

            var rzp1 = new window.Razorpay(razorPayOptions);
            rzp1.open();
        }).catch(err => {
            this.showDialog(true, "error", err?.response?.data?.message)
            this.stopLoading()

            console.log(err, "err")
        })
    }

    // paymentOnSuccess(response) {
    //     // this.getAllBroadCastTicket()
    //     console.log(response, "response")
    // }

    rejectTicket(value) {
        let body = {
            broadcast_obj_id: value
        }
        this.startLoading()
        new BroadCastApi().rejectTicket(body).then(res => {
            this.stopLoading()
            this.getAllBroadCastTicket()
        }).catch(err => {
            this.stopLoading()
            this.showDialog(true, "error", err?.response?.data?.message)
        })

    }

    componentDidMount() {
        this.getAllBroadCastTicket()
    }

    getFormattedAddress = (addressObject) => {
        let addressLine = addressObject?.house_number + ', ' + addressObject?.locality + ', ' +
            addressObject?.city + ', ' + addressObject?.state + ', ' + addressObject?.pincode;
        return addressLine;
    }

    getAllBroadCastTicket() {
        this.startLoading()
        new BroadCastApi().getAllBroadCastTicket().then(res => {
            let broadCastList = res?.data?.map(ite => {
                console.log("ite?.ticket_obj_id is", ite?.ticket_obj_id?.specific_requirement, typeof (ite.ticket_obj_id))
                return {
                    date_created: new Date(ite?.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }),
                    Service: ite?.ticket_obj_id?.service_provided_for?.service_name,
                    specific_requirement: ite?.ticket_obj_id?.specific_requirement,
                    address_details: this.getFormattedAddress(ite?.ticket_obj_id?.address_details),
                    status_of_ticket: ite?.status_of_ticket,
                    personal_details: ite?.ticket_obj_id?.personal_details?.name,
                    Action: ite
                }
            })

            this.stopLoading()
            this.setState({ broadCastList: broadCastList })

        }).catch(err => {
            this.stopLoading()
            console.log(err)
            this.showDialog(true, "error", err?.response?.data?.message)

        })
    }

    closeDialog = (open = false) => {
        this.setState({
            snackBarValues: {
                open: open,
                msg: "",
                duration: 5000,
                type: ""
            }
        })


    }

    showDialog = (open, type, msg) => {
        this.setState({
            snackBarValues: {
                open: open,
                msg: msg,
                duration: 5000,
                type: type
            }
        })

    }
    startLoading = () => {
        this.setState({ is_loading: true });
    }

    stopLoading = () => {
        this.setState({ is_loading: false });
    }

    render() {

        let { snackBarValues, is_loading } = this.state
        return (
            <div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={this.state.is_loading}
                    onClick={this.stopLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                {
                    snackBarValues.open && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={snackBarValues.open} autoHideDuration={snackBarValues.duration} onClose={this.closeDialog}>
                        <Alert onClose={this.closeDialog} severity={snackBarValues.type} sx={{ width: '100%' }}>
                            {snackBarValues.msg}
                        </Alert>
                    </Snackbar>
                }
                <MUIDataTable
                    title={"New Tickets"}
                    data={this.state.broadCastList}
                    columns={this.state.columns}
                    options={options}
                />
            </div>
        );
    }
}

export default Technicians;