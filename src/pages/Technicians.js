import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../Styles/style.css';

import TechnicianApi from '../components/technicianComponent/api/api'
import Button from '@mui/material/Button';
import { withRouter } from "react-router";

const options = {
    filterType: 'dropdown',
    download: false,
    print: false
};

class Technicians extends Component {
    constructor(props) {
        super(props);
        this.state = {
            technicianList: [],
            columns: [
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
                    name: "profile_created_by",
                    label: "profile created by",
                    options: {
                        filter: true,
                        sort: false,
                    }
                }, {
                    name: "referenceDetails",
                    label: "reference Details",
                    options: {
                        filter: true,
                        sort: false,
                    }
                }, {
                    name: "address_details_permanent",
                    label: "address details permanent",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "associatedWith",
                    label: "Associated CenterCode",
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
                                <Button onClick={() => this.handleEditTechnician(value?._id)} variant="contained" color="primary" >Edit Technician</Button>
                            </>
                        }
                    }
                }
            ]
        };
    }

    componentDidMount() {
        this.getAllTechnicians()
    }

    getAllTechnicians() {
        new TechnicianApi().getAllTechnician().then(res => {

            let mappedTechnician = res?.data?.map(ite => {
                return {
                    name: ite?.personal_details?.name,
                    email: ite?.personal_details?.email,
                    phone: ite?.personal_details?.phone?.country_code + ite?.personal_details?.phone?.mobile_number,
                    profile_created_by: ite?.profile_created_by,
                    referenceDetails: ite?.referenceDetails?.reference_person_name,
                    address_details_permanent: ite?.address_details_permanent?.address_line + "  " + ite?.address_details_permanent?.city + " " + ite?.address_details_permanent?.country,
                    associatedWith: this.getAssociatedCenters(ite?.center_id),
                    action: ite
                }
            })

            this.setState({ technicianList: mappedTechnician })

        }).catch(err => {
            console.log(err)

        })
    }

    getAssociatedCenters = (centersList) => {
        let centers_list = [];
        centersList && centersList.length > 0 && centersList.map((item) => {
            centers_list.push(item?.qr_details?.qr_id);
        })
        return centers_list.length > 0 ? centers_list.join(", ") : "";
    }

    handleEditTechnician = (id) => {
        this.props.history.push('/AddTechnician?edit=' + id)
    }

    render() {
        return (
            <div>
                <MUIDataTable
                    title={"Technicians"}
                    data={this.state.technicianList}
                    columns={this.state.columns}
                    options={options}
                />
            </div>
        );
    }
}

export default withRouter(Technicians);