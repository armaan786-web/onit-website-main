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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AdminApiModule from '../../components/AdminApi/Api/api';
import { withRouter } from "react-router";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'
import { connect } from 'react-redux';


import CenterRegistrationApi from '../../components/centerRegistration/Api/api';
import CenterComponentApi from '../../components/centerComponent/api/api';
import { IndianStates } from '../../assets/IndianStates';

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

const AVAILABLE_TIME_PREFERENCES = [
    'IMMEDIATELY',
    'WITHIN_24_HOURS',
    'SPECIFIC_DATE_AND_TIME',
]

class AddTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceRequired: '',
            specificRequirement: '',
            name: '',
            phoneNumber: '',
            alternatePhoneNumber: '',
            houseNumber: '',
            locality: '',
            city: '',
            state: '',
            country: 'INDIA',
            pincode: '',
            timePreference: '',
            authorizedForClient: '',
            offerCode: 'OniT 2022',
            is_paid: false,
            closing_ticket_price: "",
            admin_remarks: "",
            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
            specific_date_time: new Date(),
            isFormValid: false,
            servicesList: [],
            clientsList: [],

            isRegistering: false,
            isEditDetailsExists: false,
            doesTicketExists: false
        };
    }

    componentDidMount() {
        this.getAllServicesExists();
        this.getAllClients();

        let editTicketId = new URLSearchParams(this.props.location.search).get("edit")

        console.log(editTicketId, "edit ticket id")

        if (editTicketId != null) {
            this.getTicketDetails(editTicketId)
        }


    }

    onChangeSpecificDateAndTime(newValue) {
        this.setState({ specific_date_time: newValue })
    }


    getTicketObjIdForEdit() {
        return new URLSearchParams(this.props.location.search).get("edit")
    }

    getTicketDetails(editTicketId) {
        let payload = {
            ticket_obj_id: editTicketId
        }
        this.setState({
            isEditDetailsExists: true,
        })

        new AdminApiModule().getAllTickets(payload).then(res => {
            if (res?.data?.length) {
                this.setState({
                    doesTicketExists: true,
                })

                this.updateTicketDetails(res?.data?.[0])
            }

        }).catch(err => {
            console.log(err)
        })
    }

    updateTicketDetails(ticketDetails) {
        this.setState({
            serviceRequired: ticketDetails?.service_provided_for?._id,
            specificRequirement: ticketDetails?.specific_requirement,
            name: ticketDetails?.personal_details?.name,
            phoneNumber: ticketDetails?.personal_details?.primary_phone?.mobile_number,
            alternatePhoneNumber: ticketDetails?.personal_details?.alternate_phone?.mobile_number,
            houseNumber: ticketDetails?.address_details?.house_number,
            locality: ticketDetails?.address_details?.locality,
            city: ticketDetails?.address_details?.city,
            state: ticketDetails?.address_details?.state,
            country: 'INDIA',
            pincode: ticketDetails?.address_details?.pincode,
            timePreference: ticketDetails?.time_preference?.time_preference_type,
            authorizedForClient: ticketDetails?.authorized_client_id?._id,
            offerCode: 'OniT 2022',
            is_paid: ticketDetails?.admin_setting?.is_paid,
            closing_ticket_price: ticketDetails?.closing_ticket_price,
            admin_remarks: ticketDetails?.remarks.admin_remarks,
            specific_date_time: ticketDetails?.time_preference?.specific_date_time
        })
    }

    getAllServicesExists() {
        new CenterRegistrationApi().getAllServices().then(res => {
            this.setState({
                servicesList: res.data
            })
        }).catch(err => {
            console.log(err)
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

    handleChange = (e) => {
        let { name, value } = e.target
        this.setState({
            [name]: value,
        }, () => {
            console.log(this.state)
        })
    }

    handleChangeCheckBox = (e) => {
        this.setState({ is_paid: e.target.checked })
    }

    handleRegister = () => {
        const { serviceRequired, specificRequirement, name, phoneNumber, alternatePhoneNumber,
            houseNumber, locality, city, state, is_paid, country, pincode, timePreference, authorizedForClient, offerCode } = this.state;


        if (!(serviceRequired &&
            name &&
            phoneNumber &&
            houseNumber &&
            pincode &&
            timePreference &&
            offerCode
        )) {

            this.setState({
                isFormValid: true
            })

            this.showDialog(true, "error", "Please fill in all required details")
            return
        }

        this.setState({
            isRegistering: true,
        })

        if (this.state.timePreference == "SPECIFIC_DATE_AND_TIME") {
            if (!this.state.specific_date_time) {
                this.showDialog(true, "error", "Please fill in Specific date and time")
                return

            }
        }

        let payload = {
            personal_details: {
                primary_phone: {
                    country_code: "+91",
                    mobile_number: phoneNumber
                },
                alternate_phone: {
                    country_code: alternatePhoneNumber.length > 0 ? "+91" : "",
                    mobile_number: alternatePhoneNumber
                },
                name: name,
            },
            specific_requirement: specificRequirement,
            service_provided_for: serviceRequired,
            address_details: {
                house_number: houseNumber,
                locality: locality,
                city: city,
                state: state,
                pincode: pincode,
                country: country,
            },
            time_preference: {
                time_preference_type: timePreference,
                specific_date_time: this.state.specific_date_time,
            },
            offers_applied: {
                offer_code: offerCode
            },
            is_paid
        };

        if (authorizedForClient) {
            payload['authorized_client_id'] = authorizedForClient
        }


        if (this.state.isEditDetailsExists) {

            payload.ticket_obj_id = this.getTicketObjIdForEdit()
            payload.closing_ticket_price = this.state.closing_ticket_price || ""
            payload.admin_remarks = this.state.admin_remarks || ""
            delete payload.is_paid
            delete payload.authorized_client_id

            new AdminApiModule().updateTicket(payload).then(res => {

                this.showDialog(true, "success", "Ticket updated successfully");

                this.setState({
                    isRegistering: false,
                })

                this.props.history.push('/Tickets')
            }).catch(err => {
                console.log(err)
                this.showDialog(true, "error", err?.response?.data?.message);
                this.setState({
                    isRegistering: false,
                })
            })

            return;
        }

        new AdminApiModule().createTicket(payload).then(res => {

            this.showDialog(true, "success", "Ticket Created successfully");

            this.handleResetValues()

            setTimeout(() => {
                this.showDialog(true, "info", "Add more ticket");
            }, 2000);

        }).catch(err => {
            console.log(err)
            this.setState({
                isRegistering: false,
            })
            this.showDialog(true, "error", err?.response?.data?.message);


        })

    }


    handleResetValues() {
        this.setState({
            isRegistering: false,

            serviceRequired: '',
            specificRequirement: '',
            name: '',
            phoneNumber: '',
            alternatePhoneNumber: '',
            houseNumber: '',
            locality: '',
            city: '',
            state: '',
            country: 'INDIA',
            pincode: '',
            timePreference: '',
            offerCode: '',
            authorizedForClient: '',
            isFormValid: false,
            admin_remarks: ""
        });
    }

    render() {
        const { toast: snackBarValues, isFormValid,
            serviceRequired, specificRequirement, name, phoneNumber, alternatePhoneNumber,
            houseNumber, locality, city, state, country, pincode, timePreference, authorizedForClient, offerCode } = this.state;

        if (this.state.isEditDetailsExists && !this.state.doesTicketExists) {

            return <>
                "Page not found !!!"
            </>
        }
        if (this.state.isEditDetailsExists) {
            if (!this.props.reduxState?.adminDetails?.role_id?.permissions?.edit_ticket?.full_access) {
              return <>
                No permission to update ticket , contact admin
              </>
            }
      
          } else {
      
            if (!this.props.reduxState?.adminDetails?.role_id?.permissions?.add_ticket) {
              return <>
                No permission to add ticket , contact admin
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
                <h2 className="text-align-center">{
                    this.state.isEditDetailsExists ? "Update ticket" :
                        "Add Ticket"}</h2>
                <Item>
                    <Grid container  >
                        <Grid item md={6} style={stylesCss.paddingInnerGrids}>
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">Service You Required</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Service You Required"
                                    name="serviceRequired"
                                    onChange={this.handleChange}
                                    value={serviceRequired}
                                    error={isFormValid && !serviceRequired}

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
                                id="demo-helper-text-misaligned"
                                label="Specific Requirement - it helps"
                                style={stylesCss.inputBox}
                                name="specificRequirement"
                                value={specificRequirement}
                                onChange={this.handleChange}
                                error={isFormValid && !specificRequirement}
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Name (Contact Person)"
                                style={stylesCss.inputBox}
                                name="name"
                                value={name}
                                disabled={this.state.isEditDetailsExists}
                                onChange={this.handleChange}
                                error={isFormValid && !name}
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Phone Number"
                                style={stylesCss.inputBox}
                                disabled={this.state.isEditDetailsExists}

                                name="phoneNumber"
                                value={phoneNumber}
                                onChange={this.handleChange}
                                error={isFormValid && !phoneNumber}
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

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Alternate Phone Number"
                                style={stylesCss.inputBox}
                                name="alternatePhoneNumber"
                                value={alternatePhoneNumber}
                                disabled={this.state.isEditDetailsExists}

                                onChange={this.handleChange}
                                // error={isFormValid && !alternatePhoneNumber}
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
                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="House Number / Street"
                                style={stylesCss.inputBox}
                                name="houseNumber"
                                value={houseNumber}
                                onChange={this.handleChange}
                                error={isFormValid && !houseNumber}
                            />
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Locality"
                                style={stylesCss.inputBox}
                                name="locality"
                                value={locality}
                                onChange={this.handleChange}
                                error={isFormValid && !locality}
                            />
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="City"
                                style={stylesCss.inputBox}
                                name="city"
                                value={city}
                                onChange={this.handleChange}
                                error={isFormValid && !city}
                            />
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">State</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="State"
                                    name="state"
                                    onChange={this.handleChange}
                                    value={state}
                                    error={isFormValid && !state}

                                >
                                    {IndianStates?.map(ite => {
                                        return <MenuItem value={ite.value}>
                                            {ite.value}
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Country"
                                style={stylesCss.inputBox}
                                name="country"
                                value={country}
                                onChange={this.handleChange}
                                error={isFormValid && !country}
                                disabled
                            />
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Pincode"
                                style={stylesCss.inputBox}
                                name="pincode"
                                value={pincode}
                                onChange={this.handleChange}
                                error={isFormValid && !pincode}
                                inputProps={{ maxLength: 6 }}
                            />
                        </Grid>
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">Time Preference</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Time Preference"
                                    name="timePreference"
                                    onChange={this.handleChange}
                                    value={timePreference}
                                    error={isFormValid && !timePreference}

                                >
                                    {AVAILABLE_TIME_PREFERENCES?.map(ite => {
                                        return <MenuItem value={ite}>
                                            {ite}
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            this.state.timePreference == "SPECIFIC_DATE_AND_TIME" ? <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>

                                    <DateTimePicker
                                        renderInput={(params) => <TextField {...params} />}
                                        label="Select date and time"
                                        value={this.state.specific_date_time}
                                        onChange={(newValue) => {
                                            this.onChangeSpecificDateAndTime(newValue);
                                        }}
                                        minDate={new Date()}
                                        minTime={new Date(0, 0, 0, 8)}
                                        maxTime={new Date(0, 0, 0, 20)}
                                    />
                                </LocalizationProvider>

                            </Grid> : ""
                        }

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Offer Code"
                                style={stylesCss.inputBox}
                                name="offerCode"
                                value={offerCode}
                                onChange={this.handleChange}
                                error={isFormValid && !offerCode}
                            />
                        </Grid>

                        {
                            this.state.isEditDetailsExists ? <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                                <TextField
                                    id="demo-helper-text-misaligned"
                                    label="Closing price"
                                    style={stylesCss.inputBox}
                                    name="closing_ticket_price"
                                    type="number"
                                    value={this.state.closing_ticket_price}
                                    onChange={this.handleChange}
                                    error={isFormValid && !this.state.closing_ticket_price}
                                />
                            </Grid> : ""
                        }
                        {
                            this.state.isEditDetailsExists ? <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                                <TextField
                                    id="demo-helper-text-misaligned"
                                    label="Add admin comments"
                                    style={stylesCss.inputBox}
                                    name="admin_remarks"
                                    type="text"
                                    value={this.state.admin_remarks}
                                    onChange={this.handleChange}
                                    error={isFormValid && !this.state.admin_remarks}
                                />
                            </Grid> : ""
                        }
                        {
                            this.state.isEditDetailsExists ? " " : <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                                <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-helper-label">Authorize for particular client</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        label="Authorize for particular client"
                                        name="authorizedForClient"
                                        onChange={this.handleChange}
                                        value={authorizedForClient}
                                    // error={isFormValid && !authorizedForClient}

                                    >
                                        {this.state.clientsList?.map(ite => {
                                            return <MenuItem value={ite._id}>
                                                {ite.client_name}
                                            </MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        }

                        {
                            this.state.isEditDetailsExists ? "" : <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                                <FormGroup>
                                    <FormControlLabel control={<Switch checked={this.state.is_paid} onChange={this.handleChangeCheckBox} />} label="Pay during Acceptance" />
                                </FormGroup>
                            </Grid>
                        }

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <Button
                                variant="contained"
                                onClick={() => this.handleRegister()}
                                disabled={this.state.isRegistering}
                            >{this.state.isEditDetailsExists ? "Update " : "SUBMIT"}
                            </Button>
                        </Grid>
                    </Grid >
                </Item>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
  reduxState: state.userReducer,
})
export default connect(mapStateToProps, null)(withRouter(AddTicket));

