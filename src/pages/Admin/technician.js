import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";
import ViewActions from '../../components/AdminApi/ViewActions';
import Button from '@mui/material/Button';

import '../../Styles/style.css';

import AdminApiModule from '../../components/AdminApi/Api/api';
import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'
import BasicDateRangePicker from '../../components/common/datepicker'
import { connect } from 'react-redux';
import { withRouter } from "react-router";

const options = {
    filterType: 'dropdown',
};

class Technicians extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                }, {
                    name: "associatedWith",
                    label: "Associated CenterCode",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "authorizedFor",
                    label: "Authorized For Clients",
                    options: {
                        filter: true,
                        sort: false,
                    }
                },
                {
                    name: "action",
                    label: "Action",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <>
                                {
                                    <>
                                        <Button className="text-transform-none" variant="contained"
                                            onClick={() => this.toggleAuthorizedForPopup(value._id)}>
                                            Authorized For
                                        </Button>
                                    </>
                                }

                            </>
                        }
                    }
                },
            ],
            technicianList: [],
            isAuthorizedForPopupOpen: false,
            clientsList: [],
            selectedTechnicianId: '',

            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
        };
    }

    onClickFilter = (value) => {

        let payload = {
            start_date: value[0],
            end_date: value[1]
        }

        new AdminApiModule().getAllTechnician(payload).then(res => {

            let mappedTechnician = res?.data?.map(ite => {
                return {
                    name: ite?.personal_details?.name,
                    email: ite?.personal_details?.email,
                    phone: ite?.personal_details?.phone?.country_code + ite?.personal_details?.phone?.mobile_number,
                    profile_created_by: ite?.profile_created_by,
                    referenceDetails: ite?.referenceDetails?.reference_person_name,
                    address_details_permanent: ite?.address_details_permanent?.address_line + "  " + ite?.address_details_permanent?.city + " " + ite?.address_details_permanent?.country,
                    associatedWith: this.getAssociatedCenters(ite?.center_id),
                    authorizedFor: this.getFormattedClients(ite?.clients_ids_list),
                    action: ite

                }
            })

            this.setState({ technicianList: mappedTechnician })

        }).catch(err => {
            console.log(err)

        })

    }
    componentDidMount() {
        this.getAllTechnicians();
        this.getAllClients();
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

    getAllClients() {
        new AdminApiModule().getAllClients().then(res => {
            let parsedData = [];
            if (res && res.data && res.data.length > 0) {
                parsedData = res.data;
            }

            this.setState({
                clientsList: parsedData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    getFormattedClients = (clients) => {
        let clients_list = [];
        clients && clients.length > 0 && clients.map((item) => {
            clients_list.push(item.client_name);
        })
        return clients_list.length > 0 ? clients_list.join(", ") : "";
    }

    getAllTechnicians() {
        new AdminApiModule().getAllTechnician().then(res => {

            let mappedTechnician = res?.data?.map(ite => {
                return {
                    name: ite?.personal_details?.name,
                    email: ite?.personal_details?.email,
                    phone: ite?.personal_details?.phone?.country_code + ite?.personal_details?.phone?.mobile_number,
                    profile_created_by: ite?.profile_created_by,
                    referenceDetails: ite?.referenceDetails?.reference_person_name,
                    address_details_permanent: ite?.address_details_permanent?.address_line + "  " + ite?.address_details_permanent?.city + " " + ite?.address_details_permanent?.country,
                    associatedWith: this.getAssociatedCenters(ite?.center_id),
                    authorizedFor: this.getFormattedClients(ite?.clients_ids_list),
                    action: ite

                }
            })

            this.setState({ technicianList: mappedTechnician })

        }).catch(err => {
            console.log(err)

        })
    }

    toggleAuthorizedForPopup = (technicianId) => {
        if (technicianId) {
            this.setState({ selectedTechnicianId: technicianId })
        }
        this.setState(prevState => ({
            isAuthorizedForPopupOpen: !prevState.isAuthorizedForPopupOpen
        }));
    }

    saveAuthorizedTechnicians = (techniciansSelected) => {
        console.log("techniciansSelected is", techniciansSelected);

        let payload = {
            technician_obj_id: this.state.selectedTechnicianId,
            clients_ids_list: [...techniciansSelected]
        }

        console.log('payload is', payload);
        new AdminApiModule().adminUpdateTechnician(payload).then(res => {

            this.showDialog(true, "success", "Technician updated successfully");

            setTimeout(() => {
                this.toggleAuthorizedForPopup();
                this.getAllTechnicians();
            }, 1000);
        }).catch(err => {
            console.log(err)
            this.showDialog(true, "error", err?.response?.data?.message);
        })

    }

    getAssociatedCenters = (centersList) => {
        let centers_list = [];
        centersList && centersList.length > 0 && centersList.map((item) => {
            centers_list.push(item?.qr_details?.qr_id);
        })
        return centers_list.length > 0 ? centers_list.join(", ") : "";
    }

    render() {
        const { toast: snackBarValues } = this.state;
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

                {
                    this.props.reduxState?.adminDetails?.role_id?.permissions?.view_technician_details?.full_access ?
                        <>
                            <BasicDateRangePicker
                                onClickFilter={this.onClickFilter}
                            // refreshData={this.getAllTickets}
                            />
                            <MUIDataTable
                                title={"Technicians"}
                                data={this.state.technicianList}
                                columns={this.state.columns}
                                options={options}
                            />
                        </>
                        : "No permission , contact admin"

                }

                <ViewActions
                    isAuthorizedForPopupOpen={this.state.isAuthorizedForPopupOpen}
                    clientsList={this.state.clientsList}
                    toggleAuthorizedForPopup={this.toggleAuthorizedForPopup}
                    saveAuthorizedCenters={this.saveAuthorizedTechnicians}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})


export default connect(mapStateToProps, null)(withRouter(Technicians))