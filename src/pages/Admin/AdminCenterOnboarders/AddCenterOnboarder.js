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
import '../../../Styles/style.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AdminApiModule from '../../../components/AdminApi/Api/api';
import { withRouter } from "react-router";

import { Alert, InputAdornment, Snackbar, Typography } from '@mui/material'


import CenterRegistrationApi from '../../../components/centerRegistration/Api/api';
import { connect } from 'react-redux';
import { IndianStates } from '../../../assets/IndianStates';
import Chips from '../../CenterOnboarding/components/chips';

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

class AddCenterOnboarder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            countryCode: "+91",
            mobileNumber: "",
            // primary_services: "",
            // secondary_services: {
            //     secondary_services_id: "",
            //     priority: "",
            // },
            // allowedStates: [],
            // allowedCities: [],

            // cityValue: '',

            uniqueId: '',

            // servicesList: [],
            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
            isFormValid: false,

            isRegistering: false,
            isEditDetailsExists: false,
            doesCenterOnboarderExists: false,

        };
    }

    componentDidMount() {
        // this.getAllServicesExists()
        console.log("hey man", this.props.reduxState)

        let editCenterOnboarderId = new URLSearchParams(this.props.location.search).get("edit")

        console.log(editCenterOnboarderId, "edit center onboarder id")

        if (editCenterOnboarderId != null) {
            this.getCenterOnboarderDetails(editCenterOnboarderId)
        }


    }

    // getAllServicesExists() {
    //     new CenterRegistrationApi().getAllActiveServices().then(res => {
    //         this.setState({
    //             servicesList: res.data
    //         })
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }

    getCenterOnboarderObjIdForEdit() {
        return new URLSearchParams(this.props.location.search).get("edit")
    }

    getCenterOnboarderDetails(editCenterOnboarderId) {
        let payload = {
            center_onboarder_id: editCenterOnboarderId
        }
        this.setState({
            isEditDetailsExists: true,
        })

        new AdminApiModule().getAllCenterOnBoarder(payload).then(res => {
            if (res?.data?.length) {
                this.setState({
                    doesCenterOnboarderExists: true,
                })

                this.updateCenterOnboarderDetails(res?.data?.[0])
            }

        }).catch(err => {
            console.log(err)
        })
    }

    mapArrayToKeyLabel = (arr) => {
        return arr && arr.length > 0 && arr.map((item) => {
            return {
                key: item,
                label: item
            }
        })
    }

    updateCenterOnboarderDetails(centerOnboarderDetails) {
        this.setState({
            name: centerOnboarderDetails?.name,
            countryCode: "+91",
            mobileNumber: centerOnboarderDetails?.phone_details?.mobile_number,
            // primary_services: centerOnboarderDetails?.services?.primary_services?._id,
            // allowedStates: centerOnboarderDetails?.allowed_states.length > 0 ? this.mapArrayToKeyLabel(centerOnboarderDetails?.allowed_states) : [],
            // allowedCities: centerOnboarderDetails?.allowed_cities.length > 0 ? this.mapArrayToKeyLabel(centerOnboarderDetails?.allowed_cities) : [],
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

    handleRegister = () => {

        if (!(this.state.name &&
            this.state.mobileNumber 
            // && this.state.primary_services &&
            // this.state.allowedStates &&
            // this.state.allowedCities
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
            name: this.state.name,
            phone_details: {
                country_code: "+91",
                mobile_number: this.state.mobileNumber,
            },
            // allowed_cities: this.getArrayOfStrings(this.state.allowedCities),
            // allowed_states: this.getArrayOfStrings(this.state.allowedStates),
            // primary_services: this.state.primary_services
        }

        if (this.state.isEditDetailsExists) {

            payload.center_onboarder_id = this.getCenterOnboarderObjIdForEdit()

            payload['name'] = this.state.name || ''

            if (this.state.mobileNumber) {
                payload['phone_details'] = {
                    country_code: "+91",
                    mobile_number: this.state.mobileNumber,
                }
            }
            // payload['allowed_cities'] = (this.state.allowedCities && this.state.allowedCities.length > 0 && this.getArrayOfStrings(this.state.allowedCities)) || ''
            // payload['allowed_states'] = (this.state.allowedStates && this.state.allowedStates.length > 0 && this.getArrayOfStrings(this.state.allowedStates)) || ''
            // payload['primary_services'] = this.state.primary_services || ''

            new AdminApiModule().adminUpdateCenterOnBoarder(payload).then(res => {

                this.showDialog(true, "success", "Center Onboarder updated successfully");

                this.setState({
                    isRegistering: false,
                })

                this.props.history.push('/admin-center-onboarders')
            }).catch(err => {
                console.log(err)
                this.showDialog(true, "error", err?.response?.data?.message);
                this.setState({
                    isRegistering: false,
                })
            })

            return;
        }

        new AdminApiModule().adminCreateCenterOnBoarder(payload).then(res => {

            this.showDialog(true, "success", "Center Onboarder Created successfully");

            this.handleResetValues()
            this.props.history.push('/admin-center-onboarders');

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

            name: "",
            countryCode: "+91",
            mobileNumber: "",
            // primary_services: "",
            // secondary_services: {
            //     secondary_services_id: "",
            //     priority: "",
            // },
            // allowedStates: [],
            // allowedCities: [],
        });
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
            name, countryCode, mobileNumber, allowedStates, allowedCities, cityValue } = this.state;

        if (this.state.isEditDetailsExists && !this.state.doesCenterOnboarderExists) {

            return <>
                "Page not found !!!"
            </>
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
                    this.state.isEditDetailsExists ? "Update Center Onboarder" :
                        "Add Center Onboarder"}</h2>
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

                        {/* <Grid item md={6} style={stylesCss.paddingInnerGrids}>
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

                        </Grid> */}

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <Button
                                variant="contained"
                                onClick={() => this.handleRegister()}
                                disabled={this.state.isRegistering}
                            >{this.state.isEditDetailsExists ? "Update " : "Save"}
                            </Button>
                        </Grid>
                    </Grid >
                </Item>
            </div>
        );
    }
}

// export default withRouter(AddRole);
const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})

export default connect(mapStateToProps, null)(withRouter(AddCenterOnboarder));