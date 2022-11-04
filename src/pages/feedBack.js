import React, { useEffect, useState } from 'react'
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


import FeedBackApi from '../components/centerRegistration/Api/api'

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

export default function Feedback() {

	const [disabled, setDisabled] = useState(true)
	const [invalidFeedBackLink, setInvalidFeedbackLink] = useState(false)
	const [isFeedBackAldreadySubmitted, setIsFeedBackAldreadySubmitted] = useState(false)
	const [submitFeedBack, setSubmitFeedBack] = useState(false)
	const [is_link_expired, setis_link_expired] = useState(false)
	const [setOfQuestions, setsetOfQuestions] = useState([{
		question: "Ease in finding us and time taken for booking the service",
		answer: ""
	}, {
		question: "Transparency after booking - fixing appointment, visit and closure of ticket",
		answer: ""
	}, {
		question: "Availability of tools and equipment, knowledge of the product with service provider",
		answer: ""

	}, {
		question: "Price you paid for the service",
		answer: ""

	}, {
		question: "Overall, your service experience with ONIT",
		answer: ""

	}])


	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let token = window.location.hash.split('/')[2]

		console.log(token, "token")
		checkIfFeedBackExists(token)

	}, [])


	const checkIfFeedBackExists = (token) => {

		setLoading(true)
		new FeedBackApi().checkIfFeedBackExistsForThisId({ token: token }).then(res => {
			setInvalidFeedbackLink(res.data.invalidFeedBackLink)
			setIsFeedBackAldreadySubmitted(res.data.isFeedBackAldreadySubmitted)
			setSubmitFeedBack(res.data.submitFeedBack)
			setis_link_expired(res.data.is_link_expired)
			setLoading(false)

			if (res.data.isFeedBackExists?.feedBackResponse?.length) {
				setsetOfQuestions(res.data.isFeedBackExists?.feedBackResponse)

				console.log(res.data.isFeedBackExists?.feedBackResponse, "Feedback")
			}

		}).catch(err => {
			console.log(err)
			setLoading(false)

		})
	}

	const onChangeOfAnswer = (index, answer) => {
		let temp = setOfQuestions
		temp[index]['answer'] = answer
		setsetOfQuestions(temp)
		console.log(setOfQuestions, "setOfQuestions")

		let ans = checkIfItsValidToSubmit()
		if (ans) {
			setDisabled(false)
		} else {
			setDisabled(true)

		}
	}

	const submitFeedBackOnClick = () => {

		let payload = {
			token: window.location.hash.split('/')[2],
			feedBackResponse: setOfQuestions
		}

		new FeedBackApi().submitFeedBack(payload).then(res => {

			checkIfFeedBackExists(payload.token)
		}).catch(err => {
			console.log(err)

		})

	}

	const checkIfItsValidToSubmit = () => {
		let count = 5, answered = 0;
		setOfQuestions?.map(ite => {
			let sample = ite.answer != "" ? answered += 1 : ""
		})

		if (count == answered) {
			return true;
		} else {
			return false;
		}
	}

	if (loading) {
		return <>
			<h2 className="text-align-center">Loading page...</h2>
		</>

	}

	if (invalidFeedBackLink || is_link_expired) {

		return <>
			<h2 className="text-align-center">Invalid Feedback Link</h2>
		</>
	}

	// if (isFeedBackAldreadySubmitted) {
	// 	return <>
	// 		<h2 className="text-align-center">FeedBack is Submitted !!</h2>
	// 	</>

	// }

	return (
		<div>


			<h2 className="text-align-center">Feed back</h2>
			<Grid container style={{ width: "60%", margin: "auto" }} >
				{
					setOfQuestions?.map((ite, index) => {
						return <>
							<Grid item style={stylesCss.paddingInnerGrids} md={6}>

								<Typography variant="h4" component="h4">
									{ite.question}
								</Typography>;

							</Grid>


							<Grid item style={stylesCss.paddingInnerGrids} md={6}>

								<Select
									id="demo-helper-text-misaligned"
									label="Answer"
									name="center_name"
									onChange={(e) => onChangeOfAnswer(index, e.target.value)}
									// style={stylesCss.inputBox}
									// error={isFormValid && !this.state.center_name}
									defaultValue={ite.answer}
								>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map(ite => {
										return <MenuItem value={ite}>
											{ite}
										</MenuItem>
									})}
								</Select>
							</Grid>

						</>
					})
				}

				<Button
					onClick={() => submitFeedBackOnClick()}
					disabled={disabled}
					style={{ marginTop: "40px" }}
					variant='contained'> Submit Feedback</Button>
			</Grid>

		</div>
	)
}
