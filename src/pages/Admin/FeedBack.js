import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../../Styles/style.css';
import AdminApiModule from '../../components/AdminApi/Api/api';
import ViewFeedBackPOpup from '../../components/Components/ViewFeedBackPopup'
import { Button } from '@mui/material';
import { withRouter } from "react-router";

const options = {
    filterType: 'dropdown',
};

class Centers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedBackList: [],
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
                    name: "center_name",
                    label: "Name",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "ticket_id",
                    label: "ticket id",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "technicianName",
                    label: "Technician Name",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "technicianPhone",
                    label: "Technician Phone",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "customer_name",
                    label: "customer_name",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "customer_number",
                    label: "customer_number",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "Address",
                    label: "Address",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "FeedBack",
                    label: "FeedBack",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "is_aldready_submitted",
                    label: "is FeedBack submitted",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "over_all_rating",
                    label: "Over all rating",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "viewfeedback",
                    label: "view feedback",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <>
                                {
                                    <>
                                        <Button className="text-transform-none" variant="contained"
                                            onClick={() => this.toggleOpenFeedBackPopup(value)}>
                                            View Feedback
                                        </Button>
                                    </>


                                }

                            </>
                        }
                    }
                },
                {
                    name: "View_ticket",
                    label: "view Ticket",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <>
                                {
                                    <>

                                        <Button variant="contained" onClick={() => this.handleViewTicket(value)}  >View Ticket</Button>
                                    </>


                                }

                            </>
                        }
                    }
                },
            ],
            viewfeedback: [],
            isOpenFeedBackPopup: false
        };
    }



    handleViewTicket = (id) => {
        this.props.history.push('/view-ticket?ticketId=' + id)

    }


    toggleOpenFeedBackPopup = (viewfeedback) => {
        this.setState({ isOpenFeedBackPopup: true, viewfeedback })
    }

    toggleCloseFeedBackPopup = () => {
        this.setState({ isOpenFeedBackPopup: false, viewfeedback: [] })
    }

    componentDidMount = () => {
        this.getAllFeedBack();
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

    getAllFeedBack() {
        new AdminApiModule().getAllFeedBack().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.length > 0) {
                parsedData = this.getParsedData(res.data);
            }
            this.setState({
                feedBackList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                <MUIDataTable
                    title={"FeedBackList"}
                    data={this.state.feedBackList}
                    columns={this.state.columns}
                    options={options}
                />

                <ViewFeedBackPOpup
                    open={this.state.isOpenFeedBackPopup}
                    handleClose={this.toggleCloseFeedBackPopup}
                    viewfeedback={this.state.viewfeedback}
                />
            </div>
        );
    }
}

export default withRouter(Centers);
