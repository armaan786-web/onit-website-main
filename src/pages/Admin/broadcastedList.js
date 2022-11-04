import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../../Styles/style.css';
import AdminApiModule from '../../components/AdminApi/Api/api';
import { Button } from '@mui/material';

const options = {
    filterType: 'dropdown',
};

class BroadCastedList extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                }, {
                    name: "center_phone",
                    label: "Center phone number",
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
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <>
                                {
                                    value.status_of_ticket == "ACCEPTED" ? value?.ticket_obj_id?.address_details?.house_number + " " + value?.ticket_obj_id?.address_details?.locality + " " + value?.ticket_obj_id?.address_details?.city + " " + value?.ticket_obj_id?.address_details?.state + " " + value?.ticket_obj_id?.address_details?.country : "-"
                                }
                            </>
                        }
                    }
                },
                {
                    name: "status_of_broadcast",
                    label: "Status of broadcast",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },

            ],
            broadCastedList: []
        };
    }

    componentDidMount = () => {
        this.getAllBroadCastedList();
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
                Address: item,
                center_phone: item.center_obj_id?.personal_details?.phone?.mobile_number,
                customer_name: item?.ticket_obj_id?.personal_details?.name,
                customer_number: item?.ticket_obj_id?.personal_details?.alternate_phone?.mobile_number,
                // broadcast_id: item?._id,
                status_of_broadcast: item?.status_of_ticket
            }
        });

        return parsedData;
    }

    getAllBroadCastedList() {
        new AdminApiModule().getAllBroadCastedList().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.length > 0) {
                parsedData = this.getParsedData(res.data);
            }
            this.setState({
                broadCastedList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                <MUIDataTable
                    title={"Broadcasted list"}
                    data={this.state.broadCastedList}
                    columns={this.state.columns}
                    options={options}
                />
            </div>
        );
    }
}

export default BroadCastedList;
