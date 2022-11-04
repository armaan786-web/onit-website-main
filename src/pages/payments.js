import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../Styles/style.css';

import OrdersApi from '../components/payments/api/api'

const columns = [
    {
        name: "ticketId",
        label: "ticket Id",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "ticketAddress",
        label: "ticket Address",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "sumPriceToPay",
        label: "sum paid",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "receipt",
        label: "receipt",
        options: {
            filter: true,
            sort: false,
        }
    }, {
        name: "payment_status",
        label: "payment status",
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

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mappedOrdersList: []
        };
    }

    componentDidMount() {
        this.getAllOrders()
    }

    getAllOrders() {
        new OrdersApi().getAllCenters().then(res => {

            let mappedOrders = res?.data?.map(ite => {
                return {
                    ticketId: ite?.ticket_obj_id?._id,
                    ticketAddress: ite?.ticket_obj_id?.address_details?.house_number,
                    sumPriceToPay: ite?.sumPriceToPay / 100,
                    receipt: ite?.receipt,
                    payment_status: ite?.payment_status,
                }
            })

            this.setState({ mappedOrdersList: mappedOrders })

        }).catch(err => {
            console.log(err)

        })
    }

    render() {
        return (
            <div>
                <MUIDataTable
                    title={"Orders"}
                    data={this.state.mappedOrdersList}
                    columns={columns}
                    options={options}
                />
            </div>
        );
    }
}

export default Orders;