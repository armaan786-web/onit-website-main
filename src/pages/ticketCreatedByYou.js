import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../Styles/style.css';

import TechnicianApi from '../components/technicianComponent/api/api'

const columns = [
    {
        name: "name",
        label: "Name",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "email",
        label: "email",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "phone",
        label: "phone",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "ticket_created_by",
        label: "Ticket created by",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "address",
        label: "Address of ticket",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "broadcast_status",
        label: "Broad cast status",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "ticket_status",
        label: "Ticket status",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "service_provided_for",
        label: "Service provided for",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "assigned_center_name",
        label: "Assigned center name",
        options: {
            filter: true,
            sort: false,
        }
    }
];

const options = {
    filterType: 'dropdown',
    download: false,
    print: false
};

class Technicians extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketCreatedByList: []
        };
    }

    componentDidMount() {
        this.getAllTechnicians()
    }

    getAllTechnicians() {
        new TechnicianApi().getAllTicketCreatedByYou().then(res => {

            let ticketCreatedByList = res?.data?.map(ite => {
                return {
                    name: ite?.personal_details?.name,
                    email: ite?.personal_details?.email ?? '-',
                    phone: ite?.personal_details?.primary_phone?.country_code + ite?.personal_details?.primary_phone?.mobile_number,
                    ticket_created_by: ite?.created_by?.center_name,
                    address: ite?.address_details?.house_number + "  " + ite?.address_details?.locality + " " + ite?.address_details?.city + " " + ite?.address_details?.state + " " + ite?.address_details?.country + " " + ite?.address_details?.pincode,
                    broadcast_status: ite?.broadcast_status,
                    ticket_status: ite?.ticket_status,
                    service_provided_for: ite?.service_provided_for?.service_name,
                    assigned_center_name: ite?.assigned_ids?.assigned_center_id?.center_name ?? '-'
                }
            })

            this.setState({ ticketCreatedByList: ticketCreatedByList })

        }).catch(err => {
            console.log(err)

        })
    }


    render() {
        return (
            <div>
                <MUIDataTable
                    title={"Ticket created by you , not assigned to you"}
                    data={this.state.ticketCreatedByList}
                    columns={columns}
                    options={options}
                />
            </div>
        );
    }
}

export default Technicians;