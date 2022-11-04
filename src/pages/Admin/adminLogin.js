import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert, InputAdornment, Snackbar } from '@mui/material'

import AdminApi from '../../components/AdminApi/Api/api'
import { useHistory } from 'react-router-dom';

/**
 * redux -> import details
 */
import { setLoginDetails, setLogoutDetails } from '../../store/AdminStore/action'
import { setLoginDetails as setLoginUserDetails } from '../../store/UserStore/action'

import { useSelector, useDispatch } from 'react-redux'

const styles = {
    layout: {
        width: "40%",
        marginTop: "20%",
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    inputBox: {
        width: '100%',
        marginBottom: "10px"
    },
}


export default function AdminLogin() {

    const [adminValues, setAdminValues] = useState({
        user_name: "",
        password: ""
    });

    const [snackBarValues, setSnackBarValues] = useState({
        open: false,
        msg: "",
        duration: 5000,
        type: ""
    })

    const globalState = useSelector((state) => state.userReducer)
    const dispatch = useDispatch()
    const history = useHistory();


    const showDialog = (open, type, msg) => {
        setSnackBarValues({
            open: open,
            msg: msg,
            duration: 5000,
            type: type
        })

    }

    const closeDialog = (open = false) => {
        setSnackBarValues({
            open: open,
            msg: "",
            duration: 5000,
            type: ""
        })


    }

    const handleChangeUserNamePassword = (name, value) => {
        setAdminValues({
            ...adminValues,
            [name]: value
        })
    }

    const [isLogginIn, setIsLoggingIn] = useState(false)

    const onClickLogin = () => {
        if (!adminValues.user_name) {
            showDialog(true, "error", "Please enter user name")
            return
        }

        if (!adminValues.password) {
            showDialog(true, "error", "Please enter password")
            return

        }

        let payload = {
            user_name: adminValues.user_name,
            password: adminValues.password
        }

        setIsLoggingIn(true)
        new AdminApi().login(payload).then(res => {

            setIsLoggingIn(false)
            showDialog(true, "success", "Admin login successful")

            dispatch(
                setLoginDetails({
                    adminDetails: res?.data?.adminDetails,
                    isAdminLoggedIn: true,
                    userTokens: {
                        accessToken: res?.data?.token
                    },
                })
            )

            history.push('/Tickets')


            // dispatch(
            //     setLoginUserDetails({
            //         userDetails: {},
            //         isUserLoggedIn: false,
            //         userTokens: {
            //             accessToken: "",
            //         },
            //     }),
            // )


        }).catch(err => {
            console.log(err)
            setIsLoggingIn(false)

            showDialog(true, "error", err?.response?.data?.message)

        })
    }



    return (
        <Card style={styles.layout} sx={{ minWidth: 275 }}>

            {
                snackBarValues.open && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={snackBarValues.open} autoHideDuration={snackBarValues.duration} onClose={closeDialog}>
                    <Alert onClose={closeDialog} severity={snackBarValues.type} sx={{ width: '100%' }}>
                        {snackBarValues.msg}
                    </Alert>
                </Snackbar>
            }


            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Admin login
                </Typography>
                <TextField
                    // helperText="Enter mobile"
                    id="demo-helper-text-misaligned"
                    label="User Name"
                    style={styles.inputBox}
                    type="text"
                    disabled={isLogginIn}
                    onChange={(e) => handleChangeUserNamePassword("user_name", e.target.value)}
                />
                <TextField
                    // helperText="Enter mobile"
                    id="demo-helper-text-misaligned"
                    label="Password"
                    style={styles.inputBox}
                    type="password"
                    disabled={isLogginIn}
                    onChange={(e) => handleChangeUserNamePassword("password", e.target.value)}
                />

            </CardContent>
            <CardActions>
                {<Button
                    onClick={() => onClickLogin()}
                    disabled={isLogginIn}
                    variant="contained">
                    {isLogginIn ? "Logging In , please wait" : "Login"}</Button>}

            </CardActions>
        </Card>
    );

}
