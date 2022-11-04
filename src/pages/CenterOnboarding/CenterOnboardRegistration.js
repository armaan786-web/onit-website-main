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
import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'

import CenterOnboardApi from '../../components/CenterOnboardApi/Api/api'
import CenterRegistrationApi from '../../components/centerRegistration/Api/api'

import { IndianStates } from '../../assets/IndianStates';
import Chips from './components/chips';

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

class CenterOnboardRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            countryCode: "+91",
            mobileNumber: "",
            primary_services: "",
            secondary_services: {
                secondary_services_id: "",
                priority: "",
            },
            allowedStates: [],
            allowedCities: [],

            cityValue: '',

            uniqueId: '',

            servicesList: [],
            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
            isFormValid: false,

            sendingOtp: false,
            isOtpSentSuccess: false,
            otpEntered: '',

            isVerifyingOtp: false,
            isOtpVerfied: false,

            isRegistering: false,
        };
    }

    componentDidMount() {
        this.getAllServicesExists()
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

    handleChange = (e) => {
        let { name, value } = e.target

        this.setState({
            [name]: value,
        }, () => {
            console.log(this.state)
        })
    }

    handleChangeStates = (e) => {

        let { name, value } = e.target

        let arr = [...this.state.allowedStates];
        arr.push({ key: value, label: value });
        this.setState({
            allowedStates: arr
        })
    }

    getArrayOfStrings = (data) => {
        return data && data.length > 0 && data.map(item => item.label);
    }

    handleSendOtp = () => {
        if (!(this.state.name &&
            this.state.mobileNumber &&
            this.state.primary_services &&
            this.state.allowedStates &&
            this.state.allowedCities)) {

            this.setState({
                isFormValid: true
            })

            this.showDialog(true, "error", "Please fill in all required details")
            return
        }

        this.setState({
            sendingOtp: true,

        })

        let payload = {
            name: this.state.name,
            country_code: "+91",
            mobile_number: this.state.mobileNumber,
            allowed_cities: this.getArrayOfStrings(this.state.allowedCities),
            allowed_states: this.getArrayOfStrings(this.state.allowedStates),
            primary_services: this.state.primary_services
        }

        new CenterOnboardApi().SendOtpOnboarder(payload).then(res => {

            this.showDialog(true, "success", "otp sent successfully");

            this.setState({
                sendingOtp: false,
                isOtpSentSuccess: true,
                uniqueId: res?.data?.uniqueId
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                sendingOtp: false,
            })
            this.showDialog(true, "error", err?.response?.data?.message);


        })

    }

    handleVerifyOtp = () => {

        let { otpEntered } = this.state
        if (!otpEntered) {
            this.showDialog(true, "error", "otp not entered")
            return
        }

        let payload = {
            uniqueId: this.state.uniqueId,
            otp: otpEntered
        }

        this.setState({
            isVerifyingOtp: true,

        })


        new CenterOnboardApi().RegisterOnboarder(payload).then(res => {

            this.showDialog(true, "success", "Registered successfully , register ");

            this.setState({
                isVerifyingOtp: false,
                isOtpVerfied: true
            })

            setTimeout(() => {
                this.props.history.push("/center-onboard-login")
            }, 5000);

        }).catch(err => {
            console.log(err)
            this.setState({
                isVerifyingOtp: false,
            })
            this.showDialog(true, "error", err?.response?.data?.message);


        })

    }


    handleRegister = () => {

        let payload = {
            name: this.state.name,
            country_code: "+91",
            mobile_number: this.state.mobileNumber,
            allowed_cities: this.state.allowedCities,
            allowed_states: this.state.allowedStates,
            primary_services: this.state.primary_services,
        }

        this.setState({
            isRegistering: true,
        })
        new CenterOnboardApi().RegisterOnboarder(payload).then(res => {

            this.showDialog(true, "success", "Registered successfully , Please Login ");

            this.setState({
                isRegistering: false,
            })

            setTimeout(() => {
                this.props.history.push("/center-onboard-login")
            }, 5000);
            // this.handleRegister()
        }).catch(err => {
            console.log(err)
            this.setState({
                isRegistering: false,
            })
            this.showDialog(true, "error", err?.response?.data?.message);


        })

    }

    handleDeleteChipData = (chipToDelete, elementName) => () => {
        console.log("chipToDelete is", chipToDelete);
        let arr = [];

        if (elementName === "allowedStates") {
            arr = this.state.allowedStates.filter((chip) => chip.key !== chipToDelete.key)
        }
        else if (elementName === "allowedCities") {
            arr = this.state.allowedCities.filter((chip) => chip.key !== chipToDelete.key)
        }
        this.setState({ [elementName]: arr });
    };

    handleAddAllowedCities = (value) => {
        let isCityAlreadyExists = this.state.allowedCities && this.state.allowedCities.length > 0 &&
            this.state.allowedCities.find(item => item.label === value);

        if (isCityAlreadyExists) {
            this.showDialog(true, "error", "City already entered");
            return;

        };

        let arr = [...this.state.allowedCities];
        arr.push({ key: value, label: value });
        this.setState({
            allowedCities: arr,
            cityValue: ''
        })
    }

    render() {

        const { toast: snackBarValues, isFormValid,
            name, countryCode, mobileNumber, allowedStates, allowedCities,
            cityValue } = this.state

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
                <h2 className="text-align-center">Center Onboard Registration</h2>
                <Item>
                    <Grid container  >
                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                helperText="Please provide your Shop / Center (Name)"
                                id="demo-helper-text-misaligned"
                                label="Shop / Center (Name)"
                                name="name"
                                onChange={this.handleChange}
                                style={stylesCss.inputBox}
                                error={isFormValid && !name}
                                value={name}
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                helperText="Please provide your mobile number"
                                id="demo-helper-text-misaligned"
                                label="Mobile Number"
                                name="mobileNumber"
                                disabled={this.state.isOtpSentSuccess}
                                onChange={this.handleChange}
                                style={stylesCss.inputBox}
                                error={isFormValid && !mobileNumber}
                                value={mobileNumber}
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
                                    onChange={this.handleChange}
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

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <Chips chipData={allowedStates} handleDelete={(chipToDelete) => this.handleDeleteChipData(chipToDelete, "allowedStates")} />
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">State</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="State"
                                    name="state"
                                    onChange={this.handleChangeStates}
                                    value={allowedStates}
                                    error={isFormValid && !allowedStates}

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
                            <Chips chipData={allowedCities} handleDelete={(chipToDelete) => this.handleDeleteChipData(chipToDelete, "allowedCities")} />
                            <TextField
                                helperText="Allowed Cities"
                                id="demo-helper-text-misaligned"
                                label="Allowed Cities"
                                name="cityValue"
                                onChange={this.handleChange}
                                style={stylesCss.inputBox}
                                error={isFormValid && !cityValue}
                                value={cityValue}

                                InputProps={{
                                    endAdornment: <Button
                                        onClick={() => this.handleAddAllowedCities(cityValue)}
                                        variant="contained"
                                    >Add</Button>
                                }}
                            />

                        </Grid>

                        {
                            this.state.isOtpSentSuccess ? <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                                <TextField
                                    id="demo-helper-text-misaligned"
                                    label="Enter otp"
                                    name="otpEntered"
                                    onChange={this.handleChange}
                                    value={this.state.otpEntered}

                                    style={stylesCss.inputBox}
                                />
                            </Grid> : ''
                        }



                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            {!this.state.isOtpSentSuccess && <Button
                                onClick={() => this.handleSendOtp()}
                                variant="contained"
                                disabled={this.state.sendingOtp}
                            >{this.state.sendingOtp ? "Sending otp" : "Send Otp"}</Button>}


                            {this.state.isOtpSentSuccess ? <Button
                                onClick={() => this.handleVerifyOtp()}
                                variant="contained"
                                disabled={this.state.isVerifyingOtp}

                            >{this.state.isVerifyingOtp ? "Registering..." : "Register"}</Button> : ''}
                        </Grid>
                    </Grid >
                </Item>
            </div>
        );
    }
}

export default CenterOnboardRegistration;
