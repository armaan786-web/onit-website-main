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
import { connect } from 'react-redux';


import CenterRegistrationApi from '../components/centerRegistration/Api/api';
import CenterComponentApi from '../components/centerComponent/api/api';
import { IndianStates } from '../assets/IndianStates';
import { withRouter } from "react-router";

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

const ENGAGEMENT_TYPES = [
    "SALARIED",
    "PART_TIME",
    "FREELANCER",
    "SELF_EMPLOYED"
];

class AddTechnician extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            whatsAppNumber: '',
            email: '',
            primaryService: '',
            secondaryServices: {
                secondary_services_id: "",
                priority: "",
            },
            pincode: '',
            additionalPinCode: '',
            engagementType: '',
            aadharCardNumber: '',

            pan_card_document: "",
            aadharBackImage: "",

            permanentAddress: '',
            permanentCity: '',
            permanentState: '',
            permanentCountry: 'INDIA',
            currentAddress: '',
            currentCity: '',
            currentState: '',
            currentCountry: 'INDIA',
            referenceFirstPerson: '',
            referenceSecondPerson: '',
            firstPersonPhoneNumber: '',
            secondPersonPhoneNumber: '',
            pan_number: '',

            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
            isFormValid: false,
            servicesList: [],

            isRegistering: false,
            isEditDetailsExists: false,
            doesTechnicianExists: false,
        };
    }

    componentDidMount() {

        console.log(this.props.reduxState.centerDetailsPopulated)

        let listOfServices = [this.props.reduxState.centerDetailsPopulated?.services?.primary_services]

        let secondary_services = this.props.reduxState.centerDetailsPopulated?.services?.secondary_services

        if (secondary_services.length > 0) {
            listOfServices.push(secondary_services[0].secondary_services_id)
        }
        var flags = [], output = [], l = listOfServices.length, i;
        for (i = 0; i < l; i++) {
            if (flags[listOfServices[i]._id]) continue;
            flags[listOfServices[i]._id] = true;
            output.push(listOfServices[i]);
        }

        console.log({ listOfServices, output });

        this.setState({
            servicesList: output
        })

        console.log("htese ", this.props)
        let editTechnicianId = new URLSearchParams(this.props.location.search).get("edit")

        console.log(editTechnicianId, "edit technician id")

        if (editTechnicianId != null) {
            this.getTechnicianDetails(editTechnicianId)
        }

        // this.getAllServicesExists()
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

        if (name === "pincode") {
            if (value.length <= 6) {

                this.setState({ pincode: value });
            }
            return;
        }

        if (name === "additionalPinCode") {
            if (value.length <= 6) {

                this.setState({ additionalPinCode: value });
            }
            return;
        }

        if (name === "primaryService") {
            this.setState({
                secondaryServices: {
                    ...this.state.secondaryServices,
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

    handleChangeSecondaryServiceDetails = (e) => {

        let { name, value } = e.target

        this.setState({
            secondaryServices: {
                ...this.state.secondaryServices,
                [name]: value
            }
        })
    }

    handleRegister = () => {
        const { name, whatsAppNumber, email, primaryService, secondaryServices, pincode, additionalPinCode, engagementType,
            aadharCardNumber, permanentAddress, permanentCity, permanentState, permanentCountry, currentAddress, currentCity, currentState,
            currentCountry, referenceFirstPerson, referenceSecondPerson, firstPersonPhoneNumber, secondPersonPhoneNumber,
            pan_card_document, pan_number, aadharBackImage } = this.state;

        if (referenceFirstPerson.length > 0 && referenceSecondPerson.length > 0 && referenceFirstPerson === referenceSecondPerson) {
            this.showDialog(true, "error", "Emergency contact and reference person name can not be same");
            return;
        }
        if (firstPersonPhoneNumber.length > 0 && secondPersonPhoneNumber.length > 0 && firstPersonPhoneNumber === secondPersonPhoneNumber) {
            this.showDialog(true, "error", "Emergency contact and reference person phone number can not be same");
            return;
        }

        if (!(name &&
            whatsAppNumber &&
            primaryService &&
            secondaryServices.secondary_services_id &&
            pincode &&
            additionalPinCode &&
            engagementType &&
            this.state.pan_number &&
            aadharCardNumber,
            referenceFirstPerson, referenceSecondPerson, firstPersonPhoneNumber, secondPersonPhoneNumber
        )) {

            this.setState({
                isFormValid: true
            })

            this.showDialog(true, "error", "Please fill in all required details")
            return
        }
        if (!this.state.pan_card_document) {
            this.showDialog(true, "error", "Please upload your pan image");
            return
        }

        // if (!this.state.aadharBackImage) {
        //     this.showDialog(true, "error", "Please upload your adhar back image");
        //     return
        // }

        if (this.state.pan_number) {
            var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

            if (!(regpan.test(this.state.pan_number))) {
                this.showDialog(true, "error", "Please enter your valid pan number");
                return

            }
        }

        this.setState({
            isRegistering: true,
        })



        let payload = {
            "personal_details": {
                "phone": {
                    "country_code": "+91",
                    "mobile_number": whatsAppNumber
                },
                "email": email,
                "name": name,
            },
            "primary_services": primaryService,
            "secondary_services": [
                {
                    secondary_services_id: secondaryServices.secondary_services_id,
                    priority: 1,
                }
            ],
            "service_area_main_pincode": pincode,
            "service_area_secondary_pincode": [additionalPinCode],
            "address_details_permanent": {
                "address_line": permanentAddress,
                "city": permanentCity,
                "state": permanentState,
                "country": permanentCountry,
            },
            "address_details_temporary": {
                "address_line": currentAddress,
                "city": currentCity,
                "state": currentState,
                "country": currentCountry,
            },
            "engagement_type": engagementType,
            "document_details": {
                "aadhar_card_document": {
                    "front_side": "",
                    "back_side": aadharBackImage
                },
                "pan_card_document": pan_card_document,
                "aadhar_number": aadharCardNumber,
                "pan_number": pan_number
            },
            "referenceDetails": {
                "reference_person_name": referenceFirstPerson,
                "reference_person_mobile": firstPersonPhoneNumber
            },
            "emergency_details": {
                "emergency_person_name": referenceSecondPerson,
                "emergency_person_phone": secondPersonPhoneNumber
            }
        }

        if (this.state.isEditDetailsExists) {
            payload.technician_obj_id = this.getTechnicianObjIdForEdit();
            payload.service_area_secondary_pincode = additionalPinCode;

            
            let updateObject = { ...payload }
            // updateObject['personal_details.name'] = name || ''
            // updateObject['personal_details.phone.mobile_number']=whatsAppNumber || ''
            // updateObject['personal_details.email']=email || ''
            // updateObject['services.primary_services'] = primaryService || ''
            // updateObject['services.secondary_services'] = secondaryServices || ''
            // updateObject['service_area_main_pincode'] = pincode || ''
            // updateObject['service_area_secondary_pincode'] = [additionalPinCode] || ''
            // updateObject['engagement_type'] = engagementType || ''
            // updateObject['document_details.aadhar_number'] = aadharCardNumber || ''
            // updateObject['document_details.pan_card_document'] = pan_card_document || ''
            // updateObject['document_details.pan_number'] = pan_number || ''
            // updateObject['address_details_permanent.address_line'] = permanentAddress || ''
            // updateObject['address_details_permanent.city'] = permanentCity || ''
            // updateObject['address_details_permanent.state'] = permanentState || ''
            // updateObject['address_details_permanent.country'] = permanentCountry || ''
            // updateObject['address_details_temporary.address_line'] = currentAddress || ''
            // updateObject['address_details_temporary.city'] = currentCity || ''
            // updateObject['address_details_temporary.state'] = currentState || ''
            // updateObject['address_details_temporary.country'] = currentCountry || ''
            // updateObject['referenceDetails.reference_person_name'] = referenceFirstPerson || ''
            // updateObject['referenceDetails.reference_person_mobile'] = referenceSecondPerson || ''
            // updateObject['emergency_details.emergency_person_name'] = firstPersonPhoneNumber || ''
            // updateObject['emergency_details.emergency_person_phone'] = secondPersonPhoneNumber

            new CenterComponentApi().centerUpdateTechnician(updateObject).then(res => {

                this.showDialog(true, "success", "Technician updated successfully");

                this.setState({
                    isRegistering: false,
                })

                this.props.history.push('/Technicians')
            }).catch(err => {
                console.log(err)
                this.showDialog(true, "error", err?.response?.data?.message);
                this.setState({
                    isRegistering: false,
                })
            })

            return;
        }

        console.log("payload is", payload);
        new CenterComponentApi().createTechnician(payload).then(res => {

            this.showDialog(true, "success", "Technician created successfully  ");

            this.setState({
                isRegistering: false,

                name: '',
                whatsAppNumber: '',
                email: '',
                primaryService: '',
                secondaryServices: {
                    secondary_services_id: "",
                    priority: "",
                },
                pincode: '',
                additionalPinCode: '',
                engagementType: '',
                aadharCardNumber: '',

                pan_card_document: "",
                aadharBackImage: "",

                permanentAddress: '',
                permanentCity: '',
                permanentState: '',
                permanentCountry: 'INDIA',
                currentAddress: '',
                currentCity: '',
                currentState: '',
                currentCountry: 'INDIA',
                referenceFirstPerson: '',
                referenceSecondPerson: '',
                firstPersonPhoneNumber: '',
                secondPersonPhoneNumber: '',
                pan_number: '',
                isFormValid: false
            })

        }).catch(err => {
            console.log(err)
            this.setState({
                isRegistering: false,
            })
            this.showDialog(true, "error", err?.response?.data?.message);


        })

    }

    onUploadImage = (event, stateValue) => {
        let files = event.target.files;
        let aadharSideName = event.target.name;
        let fileOriginalName = files[0]?.name?.split('.')[0];
        console.log('files', files, aadharSideName, fileOriginalName, typeof (fileOriginalName));

        let file_identifier_name = 'TECHNICIAN_PAN_CARD';

        const formData = new FormData();

        formData.append(
            "aadhar",
            files[0],
            fileOriginalName
        );

        new CenterRegistrationApi().uploadImage(formData, file_identifier_name).then(res => {
            this.setState({ [stateValue]: res.data?.fileSavedUrl }, () => {
                console.log(this.state, "sssssss", stateValue)
            });
        }).catch(err => {
            console.log(err)
        })
    }

    getTechnicianObjIdForEdit() {
        return new URLSearchParams(this.props.location.search).get("edit")
    }

    getTechnicianDetails(editTechnicianId) {
        let payload = {
            technician_obj_id: editTechnicianId
        }
        this.setState({
            isEditDetailsExists: true,
        })

        new CenterComponentApi().getAllTechnician(payload).then(res => {
            if (res?.data?.length) {
                this.setState({
                    doesTechnicianExists: true,
                })

                this.updateTechnicianDetails(res?.data?.[0])
            }

        }).catch(err => {
            console.log(err)
        })
    }

    getSecondaryServicesFormatted(sArr) {
        let result = {};
        if (sArr && sArr.length > 0) {
            result['secondary_services_id'] = sArr[0]?.secondary_services_id?._id
        }
        return result;
    }
    
    updateTechnicianDetails(technicianDetails) {
        console.log("technicianDetails are", technicianDetails?.services?.primary_services?._id,
        this.getSecondaryServicesFormatted(technicianDetails?.services?.secondary_services))
        this.setState({
            name: technicianDetails?.personal_details?.name,
            whatsAppNumber: technicianDetails?.personal_details?.phone?.mobile_number,
            email: technicianDetails?.personal_details?.email,
            primaryService: technicianDetails?.services?.primary_services?._id,
            secondaryServices: this.getSecondaryServicesFormatted(technicianDetails?.services?.secondary_services),
            pincode: technicianDetails?.service_area_main_pincode,
            additionalPinCode: technicianDetails?.service_area_secondary_pincode,
            engagementType: technicianDetails?.engagement_type,
            pan_number: technicianDetails?.document_details?.pan_number,
            pan_card_document: technicianDetails?.document_details?.pan_card_document,
            aadharCardNumber: technicianDetails?.document_details?.aadhar_number,
            permanentAddress: technicianDetails?.address_details_permanent?.address_line,
            permanentCity: technicianDetails?.address_details_permanent?.city,
            permanentState: technicianDetails?.address_details_permanent?.state,
            permanentCountry: technicianDetails?.address_details_permanent?.country,
            currentAddress: technicianDetails?.address_details_temporary?.address_line,
            currentCity: technicianDetails?.address_details_temporary?.city,
            currentState: technicianDetails?.address_details_temporary?.state,
            currentCountry: technicianDetails?.address_details_temporary?.country,
            referenceFirstPerson: technicianDetails?.referenceDetails?.reference_person_name,
            referenceSecondPerson: technicianDetails?.referenceDetails?.reference_person_mobile,
            firstPersonPhoneNumber: technicianDetails?.emergency_details?.emergency_person_name,
            secondPersonPhoneNumber: technicianDetails?.emergency_details?.emergency_person_phone
        })
    }

    
    render() {
        const { toast: snackBarValues, isFormValid,
            name, whatsAppNumber, email, primaryService, secondaryServices, pincode, additionalPinCode, engagementType,
            aadharCardNumber, permanentAddress, permanentCity, permanentState, permanentCountry, currentAddress, currentCity, currentState,
            currentCountry, referenceFirstPerson, referenceSecondPerson, firstPersonPhoneNumber, secondPersonPhoneNumber } = this.state;
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
                    {this.state.isEditDetailsExists ? "Update Technician" : "Add Technician"}
                </h2>
                <Item>
                    <Grid container  >
                        <Grid item style={stylesCss.paddingInnerGrids} md={12}>
                            <TextField
                                helperText="Please provide technician's name"
                                id="demo-helper-text-misaligned"
                                label="Name"
                                style={stylesCss.inputBox}
                                name="name"
                                value={name}
                                onChange={this.handleChange}
                                error={isFormValid && !name}
                                required
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                helperText="Please provide technician's phone number"
                                id="demo-helper-text-misaligned"
                                label="What's App Number"
                                style={stylesCss.inputBox}
                                name="whatsAppNumber"
                                value={whatsAppNumber}
                                onChange={this.handleChange}
                                error={isFormValid && !whatsAppNumber}
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
                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Email"
                                style={stylesCss.inputBox}
                                name="email"
                                value={email}
                                type="email"
                                onChange={this.handleChange}
                            // error={isFormValid && !email}

                            />
                        </Grid>
                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">Main Service You Offer / Need *</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Main Service You Offer / Need *"
                                    name="primaryService"
                                    onChange={this.handleChange}
                                    // error={isFormValid && !primaryService}
                                    value={primaryService}
                                    error={isFormValid && !primaryService}

                                >
                                    {this.state.servicesList?.map(ite => {
                                        return <MenuItem value={ite?._id}>
                                            {ite?.service_name}
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">Other Service You Offer / Need *</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Other Service You Offer / Need *"
                                    name="secondary_services_id"
                                    onChange={this.handleChangeSecondaryServiceDetails}
                                    // error={isFormValid && !secondaryServices.secondaryServices_id}
                                    value={secondaryServices.secondary_services_id}
                                    error={isFormValid && !secondaryServices.secondary_services_id}

                                // multiple
                                >
                                    {this.state.servicesList?.map(ite => {
                                        return <MenuItem value={ite?._id}>
                                            {ite?.service_name}
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
                                value={pincode}
                                onChange={this.handleChange}
                                error={isFormValid && !pincode}
                                type="number"
                                required
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Additional Service Area Pincode (other)"
                                style={stylesCss.inputBox}
                                name="additionalPinCode"
                                type="number"
                                value={additionalPinCode}
                                onChange={this.handleChange}
                                error={isFormValid && !additionalPinCode}
                                required
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormControl style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">Engagement Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Engagement Type"
                                    name="engagementType"
                                    onChange={this.handleChange}
                                    // error={isFormValid && !secondaryServices.secondaryServices_id}
                                    value={engagementType}
                                    error={isFormValid && !engagementType}
                                    required

                                // multiple
                                >
                                    {ENGAGEMENT_TYPES?.map(ite => {
                                        return <MenuItem value={ite}>
                                            {ite}
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Aadhar Card Number"
                                style={stylesCss.inputBox}
                                name="aadharCardNumber"
                                value={aadharCardNumber}
                                onChange={this.handleChange}
                                error={isFormValid && !aadharCardNumber}
                                inputProps={{ maxLength: 12 }}
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <div className="aadhar-upload-button">
                                <div>
                                    {
                                        this.state.pan_card_document ? <img width="50px" height="50px"
                                            src={this.state.pan_card_document} alt="adhar front" /> : <>


                                        </>
                                    }
                                    <label htmlFor="contained-button-file">
                                        <Input name="aadharFront"
                                            accept="image/jpeg, image/jpg"
                                            id="contained-button-file" type="file" onChange={(e) => this.onUploadImage(e, "pan_card_document")} />
                                        <Button variant="contained" component="span">
                                            Pan pic
                                        </Button>
                                    </label>
                                    <div>
                                        <div>Upload image from gallery</div>
                                        <div>Max File Size (2 MB)</div>
                                    </div>
                                </div>
                            </div>
                        </Grid>

                        {/* <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <div className="aadhar-upload-button">
                                <div>
                                    {
                                        this.state.aadharBackImage ? <img width="50px" height="50px"
                                            src={this.state.aadharBackImage} alt="adhar back" /> : <>

                                        </>
                                    }

                                    <label htmlFor="contained-button-file">
                                        <Input name="aadharBackImage"
                                            accept="image/jpeg, image/jpg"
                                            id="contained-button-file"
                                            type="file"
                                            onChange={(e) => this.onUploadImage(e, "aadharBackImage")} />
                                        <Button variant="contained" component="span">
                                            Aadhar Back image
                                        </Button>
                                    </label>
                                    <div>
                                        <div>Upload image from gallery</div>
                                        <div>Max File Size (2 MB)</div>
                                    </div>

                                </div>


                            </div>
                        </Grid> */}

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter your permanent address"
                                id="demo-helper-text-misaligned"
                                label="Permanent Address"
                                style={stylesCss.inputBox}
                                name="permanentAddress"
                                value={permanentAddress}
                                onChange={this.handleChange}
                            // error={isFormValid && !permanentAddress}

                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter your pan number"
                                id="demo-helper-text-misaligned"
                                label="Pan Number"
                                style={stylesCss.inputBox}
                                name="pan_number"
                                value={this.state.pan_number}
                                onChange={this.handleChange}
                                error={isFormValid && !this.state.pan_number}

                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter your permanent city"
                                id="demo-helper-text-misaligned"
                                label="Permanent City"
                                style={stylesCss.inputBox}
                                name="permanentCity"
                                value={permanentCity}
                                onChange={this.handleChange}
                            // error={isFormValid && !permanentCity}

                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">Permanent State</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Permanent State"
                                    name="permanentState"
                                    onChange={this.handleChange}
                                    value={permanentState}
                                // error={isFormValid && !permanentState}

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
                                label="Permanent Country"
                                style={stylesCss.inputBox}
                                name="permanentCountry"
                                value={permanentCountry}
                                onChange={this.handleChange}
                                // error={isFormValid && !permanentCountry}
                                disabled
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter your current address"
                                id="demo-helper-text-misaligned"
                                label="Current Address"
                                style={stylesCss.inputBox}
                                name="currentAddress"
                                value={currentAddress}
                                onChange={this.handleChange}
                            // error={isFormValid && !currentAddress}

                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter your current city"
                                id="demo-helper-text-misaligned"
                                label="Current City"
                                style={stylesCss.inputBox}
                                name="currentCity"
                                value={currentCity}
                                onChange={this.handleChange}
                            // error={isFormValid && !currentCity}

                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <FormControl md={6} style={stylesCss.inputBox} sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">Current State</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Current State"
                                    name="currentState"
                                    onChange={this.handleChange}
                                    value={currentState}
                                // error={isFormValid && !currentState}

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
                                helperText="Please enter your current country"
                                id="demo-helper-text-misaligned"
                                label="Current Country"
                                style={stylesCss.inputBox}
                                name="currentCountry"
                                value={currentCountry}
                                onChange={this.handleChange}
                                // error={isFormValid && !currentCountry}
                                disabled
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter emergency contact person"
                                id="demo-helper-text-misaligned"
                                label="Emergency Contact Person"
                                style={stylesCss.inputBox}
                                name="referenceFirstPerson"
                                value={referenceFirstPerson}
                                onChange={this.handleChange}
                                error={isFormValid && !referenceFirstPerson}
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter emergency contact person number"
                                id="demo-helper-text-misaligned"
                                label="Emergency Contact Person Phone Number"
                                style={stylesCss.inputBox}
                                name="firstPersonPhoneNumber"
                                value={firstPersonPhoneNumber}
                                onChange={this.handleChange}
                                error={isFormValid && !firstPersonPhoneNumber}
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

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter reference second person"
                                id="demo-helper-text-misaligned"
                                label="Reference Second Person"
                                style={stylesCss.inputBox}
                                name="referenceSecondPerson"
                                value={referenceSecondPerson}
                                onChange={this.handleChange}
                                error={isFormValid && !referenceSecondPerson}
                            />
                        </Grid>

                        <Grid style={stylesCss.paddingInnerGrids} item md={6}>
                            <TextField
                                helperText="Please enter Second Person Phone Number"
                                id="demo-helper-text-misaligned"
                                label="Second Person Phone Number"
                                style={stylesCss.inputBox}
                                name="secondPersonPhoneNumber"
                                value={secondPersonPhoneNumber}
                                onChange={this.handleChange}
                                error={isFormValid && !secondPersonPhoneNumber}
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

const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})

export default connect(mapStateToProps, null)(withRouter(AddTechnician));
