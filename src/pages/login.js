import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert, InputAdornment, Snackbar } from '@mui/material'

import CenterRegistrationApi from '../components/centerRegistration/Api/api'

import { PLEASE_ENTER_MOBILE_NUMBER, MOBILE_NUMBER_TEN_CHARACTERS, OTP_SENT_SUCCESSFULLY, OTP_NOT_ENTERED, LOGGED_IN_SUCCESSFULLY } from '../components/centerRegistration/Api/const'
import { useHistory } from 'react-router-dom';

import NavBar from '../components/NavBar/navbar'
/**
 * redux -> import details
 */
import { setLoginDetails, setLogoutDetails } from '../store/UserStore/action'
import { useSelector, useDispatch } from 'react-redux'
import { setLoginDetails as adminSetLoginDetails } from '../store/AdminStore/action'

const styles = {
    layout: {
        width: 400,
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        margin: 'auto',
        transform: 'translate(-50%, -50%)',
    },
    inputBox: {
        width: 350,
        textAlign: 'center',
        marginTop: 10,

    },
    btnLayout: {
        width: 350,
        textAlign: 'center',
        margin: 'auto',
        height: 50,
        marginBottom: 20,
    },
    btnHorLayout: {
        width: 350,
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
        height: 40,
        marginBottom: 20,
    },
}


export default function Login() {

    const [mobileNumber, setMobileNumber] = useState("");

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

    const handleOnChangeMobile = (e) => {
        let value = e.target.value
        console.log(value.length, " value ")
        if (value.length > 10) {
            return
        }
        setMobileNumber(e.target.value);
    }


    const [isOtpSent, setIsOtpSent] = useState(false)
    const [otpEntered, setOtpEntered] = useState('')
    const [isOtpSending, setIsOtpSending] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const handleOnChangeOtp = (e) => {
        setOtpEntered(e.target.value)
    }

    const onClickSendOtp = () => {

        if (!mobileNumber) {
            showDialog(true, "error", PLEASE_ENTER_MOBILE_NUMBER)
            return
        }

        if (!(mobileNumber.toString().length == 10)) {
            showDialog(true, "error", MOBILE_NUMBER_TEN_CHARACTERS)
            return

        }

        let payload = {
            country_code: "+91",
            mobile_number: mobileNumber
        }
        let params = {
            action: "login"
        }

        setIsOtpSending(true)

        new CenterRegistrationApi().sendOtp(payload, params).then(res => {

            showDialog(true, "success", OTP_SENT_SUCCESSFULLY)
            setIsOtpSent(true)
            setIsOtpSending(false)
        }).catch(err => {
            console.log(err)
            showDialog(true, "error", err?.response?.data?.message)
            setIsOtpSending(false)


        })
    }

    const onClickLogin = () => {

        if (!otpEntered) {
            showDialog(true, "error", OTP_NOT_ENTERED)
            return
        }

        let payload = {
            country_code: "+91",
            mobile_number: mobileNumber,
            otp: otpEntered
        }
        setIsLoggingIn(true)

        new CenterRegistrationApi().loginCenter(payload).then(res => {

            showDialog(true, "success", LOGGED_IN_SUCCESSFULLY)
            dispatch(
                setLoginDetails({
                    userDetails: res.data.centerDetails,
                    isUserLoggedIn: true,
                    userTokens: {
                        accessToken: res.data.token,
                    },
                    centerDetailsPopulated: res?.data?.populatedCenterDetails
                }),
            )
            history.push('/brodcast-requests')

            setIsOtpSent(true)
            setIsLoggingIn(false)

        }).catch(err => {
            console.log(err)
            showDialog(true, "error", err?.response?.data?.message)
            setIsLoggingIn(false)


        })
    }

    return (
        <Card style={styles.layout} sx={{ minWidth: 200 }}>

            {
                snackBarValues.open && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={snackBarValues.open} autoHideDuration={snackBarValues.duration} onClose={closeDialog}>
                    <Alert onClose={closeDialog} severity={snackBarValues.type} sx={{ width: '100%' }}>
                        {snackBarValues.msg}
                    </Alert>
                </Snackbar>
            }

            {/* <NavBar /> */}

            <CardContent>
                <Typography sx={{ fontSize: 25 }} color="text.secondary" align="center" gutterBottom>
                    Login
                </Typography>
                <TextField
                    // helperText="Enter mobile"
                    id="demo-helper-text-misaligned"
                    label="Enter registered Phone Number *"
                    style={styles.inputBox}
                    type="number"
                    disabled={isOtpSent}
                    onChange={handleOnChangeMobile}
                    value={mobileNumber}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography >
                                    +91
                                </Typography>
                            </InputAdornment>
                        )
                    }}
                />

                {
                    isOtpSent && <>
                        <TextField
                            // helperText="Enter Otp"
                            id="demo-helper-text-misaligned"
                            label="Enter Otp"
                            style={styles.inputBox}
                            type="number"
                            onChange={handleOnChangeOtp}
                        />
                    </>
                }
            </CardContent>
            <CardActions>
                {!isOtpSent && <Button style={styles.btnLayout}
                    onClick={() => onClickSendOtp()}
                    disabled={isOtpSending}
                    variant="contained">{isOtpSending ? "Sending otp" : "Send otp"}
                </Button>}
                {isOtpSent && <Button style={styles.btnHorLayout}
                    onClick={() => onClickSendOtp()}
                    disabled={isOtpSending}
                    variant="contained">
                    {isOtpSending ? "Resending" : "Resend otp"}</Button>}

                {isOtpSent && <Button style={styles.btnHorLayout}
                    onClick={() => onClickLogin()}
                    disabled={isLoggingIn}
                    variant="contained">
                    {isLoggingIn ? "Logging In , please wait" : "Login"}</Button>}

            </CardActions>
        </Card>
    );

}
