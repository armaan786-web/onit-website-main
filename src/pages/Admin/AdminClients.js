import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../../Styles/style.css';
import AdminApiModule from '../../components/AdminApi/Api/api';
import Button from '@mui/material/Button';
import AddClient from '../Admin/AddClient';
import { withRouter } from "react-router";
import { connect } from 'react-redux';


const options = {
    filterType: 'dropdown',
};

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsList: [
                {
                    name: "clientId",
                    label: "Client Id",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "clientName",
                    label: "Client Name",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "officialEmail",
                    label: "Official Email",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "pocName",
                    label: "POC Name",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "pocDesignation",
                    label: "POC Designation",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "pocPhone",
                    label: "POC Phone",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "addressLine",
                    label: "Address Line",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "city",
                    label: "City",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "state",
                    label: "State",
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
                    name: "country",
                    label: "Country",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "gstNumber",
                    label: "GST Number",
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
                                <Button onClick={() => this.deleteClient(value?._id)} variant="contained" color="primary" >Delete</Button>
                            </>
                        }
                    }
                },
            ],
            clientsList: []
        };
        this.deleteClient = this.deleteClient.bind(this)
    }

    componentDidMount = () => {
        this.getAllClients();
    }

    getParsedData = (data) => {
        let parsedData = data && data.length > 0 && data.map((item) => {
            return {
                clientId: item?.client_id || '-',
                clientName: item?.client_name,
                officialEmail: item?.official_email,
                pocName: item?.client_poc?.person_name,
                pocDesignation: item?.client_poc?.person_designation,
                pocPhone: item?.client_poc?.phone?.country_code + item?.client_poc?.phone?.mobile_number,
                addressLine: item?.address_details?.address_line,
                city: item?.address_details?.city,
                state: item?.address_details?.state,
                pincode: item?.address_details?.pincode,
                country: item?.address_details?.country,
                gstNumber: item?.gst_number,
                createdAt: item?.createdAt,
                action: item
            }
        });

        return parsedData;
    }

    getAllClients() {
        new AdminApiModule().getAllClients().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.length > 0) {
                parsedData = this.getParsedData(res.data);
            }

            console.log("parsed data", parsedData)

            this.setState({
                clientsList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    deleteClient = (clientId) => {
        console.log("client id is", clientId);

        let payload = {
            clientId: clientId
        }
        new AdminApiModule().deleteClient(payload).then(res => {
            if (res) {
                // showDialog(true, "success", 'Client deleted successfully')
            }
            this.getAllClients();
        }).catch(err => {
            console.log(err)
            // showDialog(true, "error", err?.response?.data?.message)
        })

    }

    render() {
        return (
            <div>
                {/* <div className='add-button-div'>
                    <Button
                        variant="contained"
                    // onClick={() => this.handleRegister()}
                    // disabled={this.state.isRegistering}
                    >Add a Client
                    </Button>
                </div> */}

                {
                    this.props.reduxState?.adminDetails?.role_id?.permissions?.view_clients?.full_access ? <>
                        <div>
                            <MUIDataTable
                                title={"Clients"}
                                data={this.state.clientsList}
                                columns={this.state.columnsList}
                                options={options}
                            />
                        </div>
                    </> : "No access to view client contact admin"
                }
                <br />

                {
                    this.props.reduxState?.adminDetails?.role_id?.permissions?.add_clients ? <>
                        <div>
                            <AddClient />
                        </div>
                    </> : "No access add client contact admin"
                }


            </div>

        );
    }
}


const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})


export default connect(mapStateToProps, null)(withRouter(Clients));

