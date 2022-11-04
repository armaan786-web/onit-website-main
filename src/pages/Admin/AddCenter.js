import React, { Component } from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import '../../Styles/style.css';
import { Alert, FormControlLabel, FormGroup, InputAdornment, Snackbar, Switch, Typography } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { withRouter } from "react-router";
import { connect } from 'react-redux';

import CenterRegistrationApi from '../../components/centerRegistration/Api/api'
import { IndianStates } from '../../assets/IndianStates';
import th from 'date-fns/esm/locale/th/index.js';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,

}));

const stylesCss = {
  inputBox: {
    width: '100%',
    marginBottom: "10px"
  },
  gridStyle: {
    width: '80%',
    margin: 'auto'
  },
  paddingInnerGrids: {
    paddingRight: "10px",
    paddingLeft: "10px",
    paddingTop: "10px"
  }
}

class CenterRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center_name: "",
      personal_details: {
        phone: {
          country_code: "+91",
          mobile_number: "",
        },
        email: "",
        name: "",
        user_name: "",
        about: "",
      },
      primary_services: "",
      secondary_services: {
        secondary_services_id: "",
        priority: "",
      },
      address_details: {
        // longitude: "",
        // latitude: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        additional_pincode: "",
        country: "INDIA",
        // short_code_for_place: "",
        // google_geo_location: "",
      },
      no_of_technicians: "",
      automate_qr_code: false,
      qr_code: "",
      upi_id: "",
      toast: {
        open: false,
        msg: "",
        duration: 5000,
        type: ""

      },
      isFormValid: false,
      servicesList: [],

      sendingOtp: false,
      isOtpSentSuccess: false,
      otpEntered: '',

      isVerifyingOtp: false,
      isOtpVerfied: false,

      isRegistering: false,

      allClientsList: [],
      clients_ids_list: [],

      login_into_application: false,
      accepting_broadcast_ticket: false,

      doesCenterExists: false,
      isEditDetailsExists: false
    };
  }

  componentDidMount() {
    this.getAllServicesExists()
    this.getAllClients()

    let path = window.location.hash.split('?')
    console.log(path, "path", new URLSearchParams(this.props.location.search).get("edit"))
    let editCenterId = new URLSearchParams(this.props.location.search).get("edit")

    if (editCenterId != null) {
      this.getCenterDetails(editCenterId)
    }

  }

  getCenterIdForEdit() {
    return new URLSearchParams(this.props.location.search).get("edit")
  }

  getCenterDetails(id) {
    let payload = {
      center_obj_id: id,
    }

    this.setState({
      isEditDetailsExists: true,
    })

    new CenterRegistrationApi().getCenterDetails(payload).then(res => {

      if (res?.data?.length) {
        this.setState({
          doesCenterExists: true,
        })
        this.updateStateOfEditData(res?.data?.[0])
      }


    }).catch(err => {
      console.log(err)
    })

  }

  updateStateOfEditData(centerDetails) {
    this.setState({
      center_name: centerDetails?.center_name,
      personal_details: {
        phone: {
          country_code: "+91",
          mobile_number: centerDetails?.personal_details?.phone?.mobile_number,
        },
        email: centerDetails?.personal_details?.email,
        name: centerDetails?.personal_details?.name,
        user_name: centerDetails?.personal_details?.user_name,
        about: centerDetails?.personal_details?.about,
      },
      primary_services: centerDetails?.services?.primary_services?._id,
      secondary_services: {
        secondary_services_id: centerDetails?.services?.secondary_services?.[0]?.secondary_services_id?._id,
        priority: centerDetails?.services?.secondary_services?.[0]?.secondary_services_id?.priority,
      },
      address_details: {
        // longitude: centerDetails?.address_details?.longitude,
        // latitude: centerDetails?.address_details?.latitude,
        address_line: centerDetails?.address_details?.address_line,
        city: centerDetails?.address_details?.city,
        state: centerDetails?.address_details?.state,
        pincode: centerDetails?.address_details?.pincode,
        additional_pincode: centerDetails?.address_details?.additional_pincode,
        country: "INDIA",
        // short_code_for_place: centerDetails?.address_details?.short_code_for_place,
        // google_geo_location: centerDetails?.address_details?.google_geo_location,
      },
      upi_id: centerDetails?.payment_details?.upi_id,
      no_of_technicians: centerDetails?.no_of_technicians,
      clients_ids_list: centerDetails?.clients_ids_list?.map(ite => ite._id),
      login_into_application: centerDetails?.disabled_for?.login_into_application,
      accepting_broadcast_ticket: centerDetails?.disabled_for?.accepting_broadcast_ticket,

    })
  }

  getAllClients() {
    new CenterRegistrationApi().getAllClients().then(res => {
      this.setState({
        allClientsList: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  getAllServicesExists() {
    new CenterRegistrationApi().getAllActiveServices().then(res => {
      this.setState({
        servicesList: res.data
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

  handleInputChangeClients = (event) => {

    const {
      target: { value },
    } = event;
    console.log(value)

    this.setState({
      clients_ids_list: typeof value === 'string' ? value.split(',') : value
    })


  }

  handleChangeInputOuter = (e) => {
    let { name, value } = e.target

    if (name === "primary_services") {
      this.setState({
        secondary_services: {
          ...this.state.secondary_services,
          secondary_services_id: value
        }
      })
    }

    this.setState({
      [name]: value,
    }, () => {
      console.log(this.state)
    })
  }

  handleChangePersonalDetails = (e) => {
    let { name, value } = e.target

    this.setState({
      personal_details: {
        phone: {
          ...this.state.personal_details.phone,
          [name]: value

        }
      }
    }, () => {
      console.log(this.state)
    })
  }

  handleResetStateValues = () => {
    this.setState({
      center_name: "",
      personal_details: {
        phone: {
          country_code: "+91",
          mobile_number: "",
        },
        email: "",
        name: "",
        user_name: "",
        about: "",
      },
      primary_services: "",
      secondary_services: {
        secondary_services_id: "",
        priority: "",
      },
      address_details: {
        // longitude: "",
        // latitude: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        additional_pincode: "",
        country: "INDIA",
        // short_code_for_place: "",
        // google_geo_location: "",
      },
      no_of_technicians: "",
      qr_code: "",
      upi_id: "",

      isFormValid: false,

      sendingOtp: false,
      isOtpSentSuccess: false,
      otpEntered: '',

      isVerifyingOtp: false,
      isOtpVerfied: false,

      isRegistering: false,
      clients_ids_list: []
    })
  }

  handleChangeAddressDetails = (e) => {

    let { name, value } = e.target

    if (name === "pincode") {
      if (value.length <= 6) {
        this.setState({
          address_details: {
            ...this.state.address_details,
            additional_pincode: value
          }
        }, () => {
          this.setState({
            address_details: {
              ...this.state.address_details,
              [name]: value
            }
          })
        })

      }
      return;
    }

    this.setState({
      address_details: {
        ...this.state.address_details,
        [name]: value
      }
    })
  }

  handleChangeSecondaryServiceDetails = (e) => {

    let { name, value } = e.target

    this.setState({
      secondary_services: {
        ...this.state.secondary_services,
        [name]: value
      }
    })
  }




  handleRegister = () => {

    if (!(this.state.center_name &&
      this.state.personal_details.phone.mobile_number &&
      this.state.primary_services &&
      this.state.secondary_services.secondary_services_id &&
      this.state.address_details.address_line &&
      this.state.address_details.city &&
      this.state.address_details.state &&
      this.state.address_details.pincode &&
      this.state.address_details.country &&
      (this.state.no_of_technicians === 0 || this.state.no_of_technicians) &&
      this.state.address_details.additional_pincode)) {

      this.setState({
        isFormValid: true
      })

      this.showDialog(true, "error", "Please fill in all required details")
      return
    }

    let payload = {
      center_name: this.state.center_name,
      personal_details: this.state.personal_details,
      primary_services: this.state.primary_services,
      secondary_services: [
        {
          secondary_services_id: this.state.secondary_services.secondary_services_id,
          priority: 1,

        }
      ],
      address_details: this.state.address_details,
      no_of_technicians: this.state.no_of_technicians,
      clients_ids_list: this.state.clients_ids_list
    }

    this.setState({
      isRegistering: true,
    })

    if (this.state.isEditDetailsExists) {

      payload.center_obj_id = this.getCenterIdForEdit()
      payload = {
        ...payload,
        login_into_application: this.state.login_into_application,
        accepting_broadcast_ticket: this.state.accepting_broadcast_ticket,
        upi_id: this.state.upi_id
      }
      new CenterRegistrationApi().updateCenterAdmin(payload).then(res => {

        this.showDialog(true, "success", "Center Updated ");

        this.setState({
          isRegistering: false,
        })

      }).catch(err => {
        console.log(err)
        this.setState({
          isRegistering: false,
        })
        this.showDialog(true, "error", err?.response?.data?.message);


      })

      return
    }

    payload = {
      ...payload,
      qr_code: this.state.qr_code,
      automate_qr_code: this.state.automate_qr_code
    }

    new CenterRegistrationApi().adminCreateCenter(payload).then(res => {

      this.showDialog(true, "success", "Center added ! Add more centers ");

      this.setState({
        isRegistering: false,
      })

      this.handleResetStateValues()

    }).catch(err => {
      console.log(err)
      this.setState({
        isRegistering: false,
      })
      this.showDialog(true, "error", err?.response?.data?.message);


    })

  }

  handleChangeCheckBox = (e, name) => {
    this.setState({ [name]: e.target.checked })
  }



  render() {

    const { toast: snackBarValues, isFormValid } = this.state

    if (this.state.isEditDetailsExists && !this.state.doesCenterExists) {

      return <>
        "Page not found !!!"
      </>
    }

    if (this.state.isEditDetailsExists) {
      if (!this.props.reduxState?.adminDetails?.role_id?.permissions?.update_center?.full_access) {
        return <>
          No permission to update center , contact admin
        </>
      }

    } else {

      if (!this.props.reduxState?.adminDetails?.role_id?.permissions?.add_center) {
        return <>
          No permission to add center , contact admin
        </>
      }
    }


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
        <h2 className="text-align-center">{this.state.isEditDetailsExists ? "Update center" : "Add Center"}</h2>
        <Item>
          <Grid container  >
            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <TextField
                helperText="Please provide your Shop / Center (Name)"
                id="demo-helper-text-misaligned"
                label="Shop / Center (Name)"
                name="center_name"
                onChange={this.handleChangeInputOuter}
                style={stylesCss.inputBox}
                error={isFormValid && !this.state.center_name}
                value={this.state.center_name}
              />
            </Grid>

            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <TextField
                helperText="Please provide your Shop / Center (Name)"
                id="demo-helper-text-misaligned"
                label="What's App Number"
                name="mobile_number"
                disabled={this.state.isOtpSentSuccess}
                onChange={this.handleChangePersonalDetails}
                style={stylesCss.inputBox}
                error={isFormValid && !this.state.personal_details.phone.mobile_number}
                value={this.state.personal_details.phone.mobile_number}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>+91</Typography>
                    </InputAdornment>
                  )
                }}
                inputProps={{ maxLength: 10 }}

              />
            </Grid>

            <Grid item md={6} style={stylesCss.paddingInnerGrids}>
              <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">Main Service You Offer / Need</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Main Service You Offer / Need"
                  name="primary_services"
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  onChange={this.handleChangeInputOuter}
                  error={isFormValid && !this.state.primary_services}
                  value={this.state.primary_services}


                >
                  {this.state.servicesList?.map(ite => {
                    return <MenuItem value={ite._id}>
                      {ite.service_name}
                    </MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>

            {/* change herer */}
            <Grid item md={6} style={stylesCss.paddingInnerGrids}>
              <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">Choose clients</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Choose clients"
                  name="clients_ids_list"
                  multiple
                  onChange={this.handleInputChangeClients}
                  error={isFormValid && !this.state.clients_ids_list.length}
                  value={this.state.clients_ids_list}
                >
                  {this.state.allClientsList?.map(ite => {
                    return <MenuItem value={ite._id}>
                      {ite.client_name}
                    </MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={6} style={stylesCss.paddingInnerGrids}>
              <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">Other Service You Offer / Need</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Other Service You Offer / Need"
                  name="secondary_services_id"
                  onChange={this.handleChangeSecondaryServiceDetails}
                  error={isFormValid && !this.state.secondary_services.secondary_services_id}
                  value={this.state.secondary_services.secondary_services_id}

                // multiple
                >
                  {this.state.servicesList?.map(ite => {
                    return <MenuItem value={ite._id}>
                      {ite.service_name}
                    </MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <TextField
                helperText="Please enter your address"
                id="demo-helper-text-misaligned"
                label="Address"
                name="address_line"
                onChange={this.handleChangeAddressDetails}
                style={stylesCss.inputBox}
                error={isFormValid && !this.state.address_details.address_line}
                value={this.state.address_details.address_line}

              />
            </Grid>

            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <TextField
                helperText="Please enter your city"
                id="demo-helper-text-misaligned"
                label="City"
                name="city"
                onChange={this.handleChangeAddressDetails}
                error={isFormValid && !this.state.address_details.city}
                value={this.state.address_details.city}

                style={stylesCss.inputBox}
              />
            </Grid>

            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">State</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="State"
                  name="state"
                  onChange={this.handleChangeAddressDetails}
                  value={this.state.address_details.state}
                  error={isFormValid && !this.state.address_details.state}

                >
                  {IndianStates?.map(ite => {
                    return <MenuItem value={ite.value}>
                      {ite.value}
                    </MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <TextField
                id="demo-helper-text-misaligned"
                label="Country"
                name="country"
                onChange={this.handleChangeAddressDetails}
                error={isFormValid && !this.state.address_details.country}
                value={this.state.address_details.country}
                style={stylesCss.inputBox}
                disabled
              />
            </Grid>

            {
              this.state.isEditDetailsExists && <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                <FormGroup>
                  <FormControlLabel control={<Switch checked={this.state.login_into_application} onChange={(e) => this.handleChangeCheckBox(e, "login_into_application")} />} label="Disable login" />
                </FormGroup>
              </Grid>
            }

            {
              this.state.isEditDetailsExists && <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                <FormGroup>
                  <FormControlLabel control={<Switch checked={this.state.accepting_broadcast_ticket} onChange={(e) => this.handleChangeCheckBox(e, "accepting_broadcast_ticket")} />} label="Disable accepting ticket" />
                </FormGroup>
              </Grid>
            }

            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <TextField
                helperText="Please enter your pincode"
                id="demo-helper-text-misaligned"
                label="Service Area Pincode (main)"
                name="pincode"
                type="number"
                onChange={this.handleChangeAddressDetails}
                error={isFormValid && !this.state.address_details.pincode}
                value={this.state.address_details.pincode}

                style={stylesCss.inputBox}
                inputProps={{ maxLength: 6 }}
              />
            </Grid>

            <Grid item style={stylesCss.paddingInnerGrids} md={6}>
              <TextField
                helperText="Please enter your additional pincode"
                id="demo-helper-text-misaligned"
                label="Addtional Service Area Pincode (other)"
                name="additional_pincode"
                onChange={this.handleChangeAddressDetails}
                error={isFormValid && !this.state.address_details.additional_pincode}
                value={this.state.address_details.additional_pincode}

                style={stylesCss.inputBox}
                inputProps={{ maxLength: 6 }}
              />
            </Grid>

            <Grid item md={6} style={stylesCss.paddingInnerGrids}>
              <FormControl style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">Technician Associate</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Technician Associate"
                  name="no_of_technicians"
                  onChange={this.handleChangeInputOuter}
                  error={isFormValid && this.state.no_of_technicians === ""}
                  value={this.state.no_of_technicians}

                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(ite => {
                    return <MenuItem value={ite}>{ite}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>

            {
              this.state.isEditDetailsExists ? "" : <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                <FormGroup>
                  <FormControlLabel control={<Switch checked={this.state.automate_qr_code} onChange={(e) => this.handleChangeCheckBox(e, "automate_qr_code")} />} label="Automate qr code" />
                </FormGroup>
              </Grid>
            }
            {
              !this.state.isEditDetailsExists ? !this.state.automate_qr_code ? <>
                <Grid item md={6} style={stylesCss.paddingInnerGrids}>

                  <TextField
                    helperText="Please enter your additional pincode"
                    id="demo-helper-text-misaligned"
                    label="Enter qr code"
                    name="qr_code"
                    onChange={(e) => {
                      this.setState({ qr_code: e.target.value })
                    }}
                    value={this.state.qr_code}
                    style={stylesCss.inputBox}
                  />
                </Grid>
              </> : ""
                : ""
            }
            {
              this.state.isEditDetailsExists ? <>
                <Grid item md={6} style={stylesCss.paddingInnerGrids}>

                  <TextField
                    helperText="Please enter your additional pincode"
                    id="demo-helper-text-misaligned"
                    label="Enter upi id"
                    name="upi_id"
                    onChange={(e) => {
                      this.setState({ upi_id: e.target.value })
                    }}
                    value={this.state.upi_id}
                    style={stylesCss.inputBox}
                  />
                </Grid>
              </> : ""
            }

            {
              this.state.isOtpSentSuccess && !this.state.isOtpVerfied ? <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                <TextField
                  id="demo-helper-text-misaligned"
                  label="Enter otp"
                  name="otpEntered"
                  onChange={this.handleChangeInputOuter}
                  value={this.state.otpEntered}

                  style={stylesCss.inputBox}
                />
              </Grid> : ''
            }



            <Grid style={stylesCss.paddingInnerGrids} item md={6}>

              {<Button
                onClick={() => this.handleRegister()}
                variant="contained"
                disabled={this.state.isRegistering}
              >{this.state.isRegistering ? this.state.isEditDetailsExists ? "Updating...." : "Adding ...." : this.state.isEditDetailsExists ? "Update center" : "Add center"}</Button>}
            </Grid>
          </Grid >
        </Item>
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  reduxState: state.userReducer,
})
export default connect(mapStateToProps, null)(withRouter(CenterRegistration));
