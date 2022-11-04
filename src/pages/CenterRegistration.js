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

import CenterRegistrationApi from '../components/centerRegistration/Api/api'
import { IndianStates } from '../assets/IndianStates';
import { withRouter } from "react-router";

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
            center_on_boarder_object: {},

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
        };
    }

    componentDidMount() {
        this.getAllServicesExists()

        let center_on_boarder_id = this?.props?.match?.params?.centerOnboarderId

        if (center_on_boarder_id != null) {
            this.getCenterOnboarderDetails(center_on_boarder_id)
        }
    }

    getCenterOnboarderDetails(centerOnboarderId) {
        let payload = {
            center_onboarder_id: centerOnboarderId
        }

        new CenterRegistrationApi().getCenterOnboarderObjectId(payload).then(res => {
            if (res?.data?.length) {
                this.setState({ center_on_boarder_object: res.data?.[0] });
            }

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


    handleSendOtp = () => {


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

        this.setState({
            sendingOtp: true,

        })

        let payload = {
            country_code: this.state.personal_details.phone.country_code,
            mobile_number: this.state.personal_details.phone.mobile_number,

        }

        let params = {
            action: "registration"
        }

        new CenterRegistrationApi().sendOtp(payload, params).then(res => {

            this.showDialog(true, "success", "otp sent successfully");

            this.setState({
                sendingOtp: false,
                isOtpSentSuccess: true
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
            country_code: "+91",
            mobile_number: this.state.personal_details.phone.mobile_number,
            otp: otpEntered
        }

        this.setState({
            isVerifyingOtp: true,

        })


        new CenterRegistrationApi().verifyOtp(payload).then(res => {

            this.showDialog(true, "success", "otp verified successfully , register ");

            this.setState({
                isVerifyingOtp: false,
                isOtpVerfied: true
            })

            this.handleRegister()
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

        }

        if (this.state.center_on_boarder_object && this.state.center_on_boarder_object._id) {
            payload["onboarded_by"] = this.state.center_on_boarder_object._id
        }

        this.setState({
            isRegistering: true,
        })
        new CenterRegistrationApi().registerCenter(payload).then(res => {

            this.showDialog(true, "success", "Registered successfully , Please Login ");

            this.setState({
                isRegistering: false,
            })

            setTimeout(() => {
                this.props.history.push("/login")
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

    render() {

        const { toast: snackBarValues, isFormValid } = this.state

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
                <h2 className="text-align-center">
                    Center Registration
                </h2>
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
                            {!this.state.isOtpSentSuccess && <Button
                                onClick={() => this.handleSendOtp()}
                                variant="contained"
                                disabled={this.state.sendingOtp}
                            >{this.state.sendingOtp ? "Sending otp" : "Send Otp"}</Button>}

                            {this.state.isOtpSentSuccess && !this.state.isOtpVerfied ? <Button
                                onClick={() => this.handleVerifyOtp()}
                                variant="contained"
                                disabled={this.state.isVerifyingOtp}

                            >{this.state.isVerifyingOtp ? "Verifying otp" : "Verify Otp"}</Button> : ''}

                            {this.state.isOtpVerfied && <Button
                                onClick={() => this.handleRegister()}
                                variant="contained"
                                disabled={this.state.isRegistering}
                            >{this.state.isRegistering ? "Registering" : "Register"}</Button>}
                        </Grid>
                    </Grid >
                </Item>
            </div>
        );
    }
}

export default withRouter(CenterRegistration);