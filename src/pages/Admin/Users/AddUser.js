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

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            phoneNumber: '',
            roleChosenId: '',

            rolesList: [],
            toast: {
                open: false,
                msg: "",
                duration: 5000,
                type: ""

            },
            isFormValid: false,

            isRegistering: false,
            isEditDetailsExists: false,
            doesUserExists: false,

        };
    }

    componentDidMount() {
        this.getAllRolesExists();

        console.log("hey man", this.props.reduxState)

        let editUserId = new URLSearchParams(this.props.location.search).get("edit")

        console.log(editUserId, "edit user id")

        if (editUserId != null) {
            this.getUserDetails(editUserId)
        }


    }

    getAllRolesExists() {
        new AdminApiModule().getAllAvailableRoles().then(res => {
            this.setState({
                rolesList: res.data
            })
        }).catch(err => {
            console.log(err)
        })
    }

    getUserObjIdForEdit() {
        return new URLSearchParams(this.props.location.search).get("edit")
    }

    getUserDetails(editUserId) {
        let payload = {
            user_obj_id: editUserId
        }
        this.setState({
            isEditDetailsExists: true,
        })

        new AdminApiModule().getAllUsers(payload).then(res => {
            if (res?.data?.length) {
                this.setState({
                    doesUserExists: true,
                })

                this.updateUserDetails(res?.data?.[0])
            }

        }).catch(err => {
            console.log(err)
        })
    }

    updateUserDetails(userDetails) {
        this.setState({
            userName: userDetails?.user_name,
            password: userDetails?.password,
            phoneNumber: userDetails?.phone_number,
            roleChosenId: userDetails?.role_id,
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

    handleRegister = () => {
        const { userName, password, phoneNumber, roleChosenId } = this.state;


        if (!(userName)) {

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
            user_name: userName,
            password: password,
            country_code: "+91",
            phone_number: phoneNumber,
            role_id: roleChosenId
        };

        if (this.state.isEditDetailsExists) {

            payload.user_obj_id = this.getUserObjIdForEdit()

            payload['user_name'] = userName || ''
            payload['password'] = password || ''
            payload['phone_number'] = phoneNumber || ''
            payload['role_id'] = roleChosenId || ''
           
            new AdminApiModule().adminUpdateRole(payload).then(res => {

                this.showDialog(true, "success", "User updated successfully");

                this.setState({
                    isRegistering: false,
                })

                this.props.history.push('/users')
            }).catch(err => {
                console.log(err)
                this.showDialog(true, "error", err?.response?.data?.message);
                this.setState({
                    isRegistering: false,
                })
            })

            return;
        }

        new AdminApiModule().adminCreateUser(payload).then(res => {

            this.showDialog(true, "success", "User Created successfully");

            this.handleResetValues()
            this.props.history.push('/users');

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

            userName: '',
            password: '',
            phoneNumber: '',
            roleChosenId: '',
        });
    }

    render() {
        const { toast: snackBarValues, isFormValid, userName, password, phoneNumber, roleChosenId } = this.state;

        if (this.state.isEditDetailsExists && !this.state.doesUserExists) {

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
                    this.state.isEditDetailsExists ? "Update User" :
                        "Add User"}</h2>
                <Item>
                    <Grid container  >
                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="User Name"
                                style={stylesCss.inputBox}
                                name="userName"
                                value={userName}
                                onChange={this.handleChange}
                                error={isFormValid && !userName}
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Password"
                                style={stylesCss.inputBox}
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                error={isFormValid && !password}
                                type="password"
                            />
                        </Grid>

                        <Grid item style={stylesCss.paddingInnerGrids} md={6}>
                            <TextField
                                id="demo-helper-text-misaligned"
                                label="Mobile Number"
                                name="phoneNumber"
                                onChange={this.handleChange}
                                style={stylesCss.inputBox}
                                error={isFormValid && !phoneNumber}
                                value={phoneNumber}
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
                                <InputLabel id="demo-simple-select-helper-label">Choose Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Choose Role"
                                    name="roleChosenId"
                                    onChange={this.handleChange}
                                    error={isFormValid && !roleChosenId}
                                    value={roleChosenId}
                                >
                                    {this.state.rolesList?.map(ite => {
                                        return <MenuItem value={ite._id}>
                                            {ite.role_name}
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
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

// export default withRouter(AddRole);
const mapStateToProps = (state) => ({
    reduxState: state.userReducer,
})

export default connect(mapStateToProps, null)(withRouter(AddUser));