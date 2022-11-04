import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

import '../../Styles/style.css';
import AdminApiModule from '../../components/AdminApi/Api/api';
import ViewActions from '../../components/AdminApi/ViewActions';
import Button from '@mui/material/Button';

import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'
import BasicDateRangePicker from '../../components/common/datepicker'
import { withRouter } from "react-router";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { connect } from 'react-redux';

const options = {
  filterType: 'dropdown',
};

const activeStatus = {
  "2": "DRAFTED",
  "-1": "IN_ACTIVE",
  "1": "ACTIVE",
  "0": "DELETED"
}

class Centers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        // {
        //     name: "center_id",
        //     label: "Center Id",
        //     options: {
        //         filter: true,
        //         sort: true,
        //     }
        // },
        {
          name: "center_name",
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
          name: "qrCode",
          label: "QR Code",
          options: {
            filter: true,
            sort: false,
          }
        },
        {
          name: "pincode",
          label: "Primary Pincode",
          options: {
            filter: true,
            sort: false,
          }
        },
        {
          name: "additional_pincode",
          label: "Secondary Pincode",
          options: {
            filter: true,
            sort: false,
          }
        },
        {
          name: "primary_services",
          label: "Primary Skill",
          options: {
            filter: true,
            sort: false,
          }
        },
        {
          name: "secondary_services",
          label: "Secondary Skill",
          options: {
            filter: true,
            sort: false,
          }
        },
        {
          name: "status",
          label: "Status",
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
          name: "onboarded_by",
          label: "Onboarded By",
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
          name: "closedTickets",
          label: "Total ticket closed",
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

                    <Button className="text-transform-none" variant="contained"
                      onClick={() => this.redirectToEditCenter(value._id)}>
                      Edit
                    </Button>
                  </>
                }

              </>
            }
          }
        },
      ],
      centersList: [],
      isAuthorizedForPopupOpen: false,
      clientsList: [],
      selectedCenterId: '',
      isLoading: false,
      toast: {
        open: false,
        msg: "",
        duration: 5000,
        type: ""

      },
    };
  }

  redirectToEditCenter(id) {
    this.props.history.push('/add-center?edit=' + id)

  }

  componentDidMount = () => {
    console.log(this.props, " set props ")
    this.getAllCenters();
    this.getAllClients();
  }

  onClickFilter = (value) => {

    let payload = {
      start_date: value[0],
      end_date: value[1]
    }

    new AdminApiModule().getAllCenters(payload).then(res => {
      let parsedData = [];
      if (res && res.data && res.data.length > 0) {
        parsedData = this.getParsedData(res.data);
      }
      this.setState({
        centersList: parsedData
      })
    }).catch(err => {
      console.log(err)
    })

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

  startLoading = () => {
    this.setState({ isLoading: true });
  }

  stopLoading = () => {
    this.setState({ isLoading: false });
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

  getFormattedServices = (services) => {
    let secondary_services_list = [];
    services && services.length > 0 && services.map((item) => {
      secondary_services_list.push(item?.secondary_services_id?.service_name);
    })
    return secondary_services_list.length > 0 ? secondary_services_list.join(", ") : "";
  }

  getFormattedClients = (clients) => {
    let clients_list = [];
    clients && clients.length > 0 && clients.map((item) => {
      clients_list.push(item.client_name);
    })
    return clients_list.length > 0 ? clients_list.join(", ") : "";
  }

  getParsedData = (data) => {
    let dateFormat = { year: "numeric", month: "short", day: "numeric" };
    let parsedData = data && data.length > 0 && data.map((item) => {
      // console.log("this.getFormattedServices(item.services.secondary_services)", this.getFormattedServices(item.services.secondary_services))
      return {
        // center_id: item._id,
        center_name: item?.center_name,
        phone: item?.personal_details?.phone?.mobile_number,
        qrCode: item?.qr_details?.qr_id,
        pincode: item?.address_details?.pincode,
        additional_pincode: item?.address_details?.additional_pincode,
        primary_services: item?.services?.primary_services?.service_name,
        secondary_services: this?.getFormattedServices(item?.services?.secondary_services),
        status: activeStatus[item.is_active],
        createdAt: new Date(item?.createdAt)?.toLocaleDateString("en-US", dateFormat),
        onboarded_by: item?.onboarded_by?.name,
        authorizedFor: this.getFormattedClients(item?.clients_ids_list),
        action: item,
        closedTickets: item?.count_details?.closed_ticket_count
      }
    });

    return parsedData;
  }

  getAllCenters() {
    this.startLoading()

    new AdminApiModule().getAllCenters().then(res => {
      let parsedData = [];
      if (res && res.data && res.data.length > 0) {
        parsedData = this.getParsedData(res.data);
      }
      this.setState({
        centersList: parsedData
      })
      this.stopLoading()

    }).catch(err => {
      console.log(err)
      this.stopLoading()

    })
  }

  toggleAuthorizedForPopup = (centerId) => {
    if (centerId) {
      this.setState({ selectedCenterId: centerId })
    }
    this.setState(prevState => ({
      isAuthorizedForPopupOpen: !prevState.isAuthorizedForPopupOpen
    }));
  }

  saveAuthorizedCenters = (centersSelected) => {

    let payload = {
      center_obj_id: this.state.selectedCenterId,
      clients_ids_list: [...centersSelected]
    }

    new AdminApiModule().adminUpdateCenter(payload).then(res => {

      this.showDialog(true, "success", "Center updated successfully");

      setTimeout(() => {
        this.toggleAuthorizedForPopup();
        this.getAllCenters();
      }, 1000);
    }).catch(err => {
      console.log(err)
      this.showDialog(true, "error", err?.response?.data?.message);
    })

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

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isLoading}
          onClick={this.stopLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>


        {
          this.props.reduxState?.adminDetails?.role_id?.permissions?.view_center_details?.full_access ? <>
            <>
              <BasicDateRangePicker
                onClickFilter={this.onClickFilter}
              // refreshData={this.getAllTickets}
              />
              <MUIDataTable
                title={"Centers"}
                data={this.state.centersList}
                columns={this.state.columns}
                options={options}
              />
            </>
          </>
            : "No access , contact admin"
        }



        <ViewActions
          isAuthorizedForPopupOpen={this.state.isAuthorizedForPopupOpen}
          clientsList={this.state.clientsList}
          toggleAuthorizedForPopup={this.toggleAuthorizedForPopup}
          saveAuthorizedCenters={this.saveAuthorizedCenters}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  reduxState: state.userReducer,
})


export default connect(mapStateToProps, null)(withRouter(Centers));