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


import CenterRegistrationApi from '../../components/centerRegistration/Api/api';
import CenterComponentApi from '../../components/centerComponent/api/api';
import { IndianStates } from '../../assets/IndianStates';
import AdminApi from '../../components/AdminApi/Api/api';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,

}));

const Input = styled('input')({
    display: 'none',
});

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

class AddTechnician extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientName: '',
            officialEmail: '',
            clientPocPersonName: '',
            clientPocPersonDesignation: '',
            clientPocPhone: '',
            addressLine: '',
            city: '',
            state: '',
            pincode: '',
            country: 'INDIA',
            gstNumber: '',

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
        if (name == "pincode") {
            if (value.length <= 6) {
                this.setState({
                    pincode: value
                })
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
        const { clientName, officialEmail, clientPocPersonName, clientPocPersonDesignation, clientPocPhone,
            addressLine, city, state, pincode, country, gstNumber } = this.state;

        if (!(clientName &&
            officialEmail &&
            clientPocPersonName &&
            clientPocPersonDesignation &&
            clientPocPhone &&
            addressLine &&
            city &&
            state &&
            pincode &&
            country &&
            gstNumber
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

        let payload = {
            "client_name": clientName,
            "official_email": officialEmail,

            "client_poc": {
                "person_name": clientPocPersonName,
                "person_designation": clientPocPersonDesignation,
                "phone": {
                    "country_code": "+91",
                    "mobile_number": clientPocPhone
                },
            },
            "address_details": {
                "address_line": addressLine,
                "city": city,
                "state": state,
                "pincode": pincode,
                "country": country
            },
            "gst_number": gstNumber,
        }

        new AdminApi().addClient(payload).then(res => {

            this.showDialog(true, "success", "Client Created successfully");

            this.setState({
                isRegistering: false,
            })
            this.componentDidMount();

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
            clientName, officialEmail, clientPocPersonName, clientPocPersonDesignation, clientPocPhone,
            addressLine, city, state, pincode, country, gstNumber
        } = this.state;
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
                <h2 className="text-align-center">Add a Client</h2>
                <Item>
                    <Grid container  >
                        <Grid item style={stylesCss.paddingInnerGrids} md={12}>
                            <TextField
                                helperText="Please provide client's name"
                                id="demo-helper-text-misaligned"
                                label="Client Name"
                                style={stylesCss.inputBox}
                                name="clientName"
                                value={clientName}
                                onChange={this.handleChange}
                                error={isFormValid && !clientName}
                                required
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={12}>
                            <TextField
                                helperText="Please provide official email"
                                id="demo-helper-text-misaligned"
                                label="Official Email"
                                style={stylesCss.inputBox}
                                name="officialEmail"
                                value={officialEmail}
                                onChange={this.handleChange}
                                error={isFormValid && !officialEmail}
                                type="email"
                                required
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={12}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Point of Contact Person Name"
                                style={stylesCss.inputBox}
                                name="clientPocPersonName"
                                value={clientPocPersonName}
                                onChange={this.handleChange}
                                error={isFormValid && !clientPocPersonName}
                                required
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={12}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Point of contact person designation"
                                style={stylesCss.inputBox}
                                name="clientPocPersonDesignation"
                                value={clientPocPersonDesignation}
                                onChange={this.handleChange}
                                error={isFormValid && !clientPocPersonDesignation}
                                required
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Point of contact phone number"
                                style={stylesCss.inputBox}
                                name="clientPocPhone"
                                value={clientPocPhone}
                                onChange={this.handleChange}
                                error={isFormValid && !clientPocPhone}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography>+91</Typography>
                                        </InputAdornment>
                                    )
                                }}
                                inputProps={{ maxLength: 10 }}
                                required
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Address"
                                style={stylesCss.inputBox}
                                name="addressLine"
                                value={addressLine}
                                onChange={this.handleChange}
                            // error={isFormValid && !addressLine}

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
                            // error={isFormValid && !city}

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
                                // error={isFormValid && !state}

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
                                label="Service Area Pincode (main)"
                                style={stylesCss.inputBox}
                                name="pincode"
                                type="number"
                                value={pincode}
                                onChange={this.handleChange}
                                error={isFormValid && !pincode}
                                required
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Country"
                                style={stylesCss.inputBox}
                                name="country"
                                value={country}
                                onChange={this.handleChange}
                                // error={isFormValid && !country}
                                disabled
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="GST Number"
                                style={stylesCss.inputBox}
                                name="gstNumber"
                                value={gstNumber}
                                onChange={this.handleChange}
                            // error={isFormValid && !gstNumber}

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

export default AddTechnician;