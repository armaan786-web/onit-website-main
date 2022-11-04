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
import '../Styles/style.css';

import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import CenterRegistrationApi from '../components/centerRegistration/Api/api';
import CenterComponentApi from '../components/centerComponent/api/api';
import { IndianStates } from '../assets/IndianStates';

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
            offerCode: 'OniT 2022',
            specific_date_time: new Date(),

            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
            isFormValid: false,
            servicesList: [],

            isRegistering: false,
        };
    }

    componentDidMount() {
        this.getAllServicesExists()
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
    onChangeSpecificDateAndTime(newValue) {
        this.setState({ specific_date_time: newValue })
    }

    handleChange = (e) => {
        let { name, value } = e.target
        if (name == "pincode") {
            if (value.length <= 6) {
                this.setState({ [name]: value })
            }
            return
        }
        this.setState({
            [name]: value,
        }, () => {
            console.log(this.state)
        })
    }

    handleRegister = () => {
        const { serviceRequired, specificRequirement, name, phoneNumber, alternatePhoneNumber,
            houseNumber, locality, city, state, country, pincode, timePreference, offerCode } = this.state;


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
            }
        }

        new CenterComponentApi().createTicket(payload).then(res => {

            this.showDialog(true, "success", "Ticket Created successfully");

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
            });

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

    render() {
        const { toast: snackBarValues, isFormValid,
            serviceRequired, specificRequirement, name, phoneNumber, alternatePhoneNumber,
            houseNumber, locality, city, state, country, pincode, timePreference, offerCode } = this.state;
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
                <h2 className="text-align-center">Add Ticket</h2>
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
                                onChange={this.handleChange}
                                error={isFormValid && !name}
                            />
                        </Grid>
                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Phone Number"
                                style={stylesCss.inputBox}
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
                                type="number"
                                value={pincode}
                                onChange={this.handleChange}
                                error={isFormValid && !pincode}
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
                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <Button
                                variant="contained"
                                onClick={() => this.handleRegister()}
                                disabled={this.state.isRegistering}
                            >SUBMIT
                            </Button>
                        </Grid>
                    </Grid >
                </Item>
            </div>
        );
    }
}

export default AddTicket;
