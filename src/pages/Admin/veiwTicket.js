import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useHistory } from "react-router-dom";
import {
    useLocation
} from "react-router-dom";
import AdminApiModule from '../../components/AdminApi/Api/api';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ImageIcon from '@mui/icons-material/Image';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ViewTicket() {
    let history = useHistory();
    let location = useLocation();

    let ticketId = new URLSearchParams(location.search).get("ticketId")
    const [isLoading, setIsLoading] = useState(false)
    const [doesTicketExists, setDoesTicketExists] = useState(false)
    const [ticketDetails, setTicketDetails] = useState({})
    const [feedBackList, setFeedBackList] = useState({})
    const [broadCastList, setBroadCastList] = useState([])
    const startLoading = () => {
        setIsLoading(true)
    }


    const stopLoading = () => {
        setIsLoading(false)
    }

    console.log(ticketId, "ticketId");

    useEffect(() => {
        getAllTickets(ticketId)
    }, [])

    const getAllTickets = (ticketId) => {
        startLoading()

        let payload = {
            ticket_obj_id: ticketId
        }
        new AdminApiModule().getSingleTicket(payload).then(res => {
            if (res?.data?.results?.length) {
                setDoesTicketExists(true)
                setTicketDetails(res?.data?.results?.[0])
                setFeedBackList(res?.data?.feedBackList?.[0])
                setBroadCastList(res?.data?.broadCastList)
            }

            stopLoading()
        }).catch(err => {
            stopLoading()

        })
    }

    if (isLoading) {
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            onClick={stopLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    }

    if (!doesTicketExists) {
        return <>InValid ticket id </>
    }

    return (
        <Box sx={{ flexGrow: 1 }}>




            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Item>

                        <>
                            Ticket Id : {ticketDetails?._id}
                        </>
                        <br />
                        <>
                            Ticket status : {ticketDetails?.ticket_status}
                        </>
                        <br />
                        <>
                            Ticket closing price : {ticketDetails?.closing_ticket_price ? ticketDetails?.closing_ticket_price : "NIL"}
                        </>
                        <br />

                        <>
                            Ticket created by : {ticketDetails?.ticket_created_by}
                        </>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><>
                        Service provided for : <Chip label={ticketDetails?.service_provided_for?.service_name} variant="outlined" />

                    </></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><>
                        Is Technician Assigned :  <Chip label={ticketDetails?.is_technician_assigned ? "Assigned " : "Not Assigned"} variant="outlined" />
                        <br />
                        Broad cast status :  <Chip label={ticketDetails?.broadcast_status} variant="outlined" />

                    </></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {"Customer Details"}
                        </Typography>

                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Customer Name"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {ticketDetails?.personal_details?.name}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Customer Phone"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {ticketDetails?.personal_details?.primary_phone?.country_code + "  " + ticketDetails?.personal_details?.primary_phone?.mobile_number}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Address details"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {"House Number" + " -  " + ticketDetails?.address_details?.house_number}
                                            </Typography>
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {"locality" + " -  " + ticketDetails?.address_details?.locality}
                                            </Typography>
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {"pincode" + " -  " + ticketDetails?.address_details?.pincode}
                                            </Typography>
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {"city" + " -  " + ticketDetails?.address_details?.city}
                                            </Typography>
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {"state" + " -  " + ticketDetails?.address_details?.state}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        </List></Item>
                </Grid>

                <Grid item xs={6}>
                    <Item>
                        <List
                            sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
                            subheader={<ListSubheader>Assigned Details</ListSubheader>}
                        >

                            {
                                ticketDetails?.is_technician_assigned ? <>
                                    <ListItem>
                                        <ListItemIcon style={{ fontWeight: "bold" }}>
                                            Assigned Center Name       :-
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary={"     " + ticketDetails?.assigned_ids?.assigned_center_id?.center_name} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon style={{ fontWeight: "bold" }}>
                                            Assigned Center Phone number   :-
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary={"     " + ticketDetails?.assigned_ids?.assigned_center_id?.personal_details?.phone?.mobile_number} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon style={{ fontWeight: "bold" }}>
                                            Assigned Center address :-
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-wifi" primary={"     " + ticketDetails?.assigned_ids?.assigned_center_id?.address_details?.address_line + " - " + ticketDetails?.assigned_ids?.assigned_center_id?.address_details?.city + " - " + ticketDetails?.assigned_ids?.assigned_center_id?.address_details?.state + " - " + ticketDetails?.assigned_ids?.assigned_center_id?.address_details?.country + " - " + ticketDetails?.assigned_ids?.assigned_center_id?.address_details?.additional_pincode} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon style={{ fontWeight: "bold" }}>
                                            Assigned Technician Name :-
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-bluetooth" primary={ticketDetails?.assigned_ids?.assigned_technician_id?.personal_details?.name} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon style={{ fontWeight: "bold" }}>
                                            Assigned Technician phone number :-
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-bluetooth" primary={ticketDetails?.assigned_ids?.assigned_technician_id?.personal_details?.phone?.mobile_number} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon style={{ fontWeight: "bold" }}>
                                            Assigned Technician address :-
                                        </ListItemIcon>
                                        <ListItemText id="switch-list-label-bluetooth" primary={ticketDetails?.assigned_ids?.assigned_technician_id?.address_details_permanent?.address_line + " - " + ticketDetails?.assigned_ids?.assigned_technician_id?.address_details_permanent?.city + " - " + ticketDetails?.assigned_ids?.assigned_technician_id?.address_details_permanent?.country + " - " + ticketDetails?.assigned_ids?.assigned_technician_id?.address_details_permanent?.state} />

                                    </ListItem>

                                </> : "Not assigned"
                            }

                        </List>
                    </Item>
                </Grid>

                <Grid item xs={6}>
                    <Item>
                        <List
                            sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
                            subheader={<ListSubheader>Remarks</ListSubheader>}
                        >
                            <ListItem>
                                <ListItemIcon style={{ fontWeight: "bold" }}>
                                    Ticket closure remarks      :-
                                </ListItemIcon>
                                <ListItemText id="switch-list-label-wifi" primary={"     " + ticketDetails?.remarks?.close_ticket_remarks} />

                            </ListItem>
                            Additional Remarks

                            {
                                ticketDetails?.remarks?.additional_remarks?.map((ite, index) => {
                                    return <>
                                        <ListItem>
                                            <ListItemIcon style={{ fontWeight: "bold" }}>
                                                {index + 1}
                                            </ListItemIcon>
                                            <ListItemText id="switch-list-label-wifi" primary={"     " + ite?.remarks} />

                                        </ListItem>

                                    </>

                                })
                            }

                        </List>
                    </Item>

                </Grid>

                <Grid item xs={6}>
                    <>Feed back list</>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {
                            feedBackList?.feedBackResponse?.length ? feedBackList?.feedBackResponse?.map(ite => {
                                return <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={ite?.question + " ? "} secondary={ite?.answer} />
                                </ListItem>
                            }) : "No feed back given"
                        }

                    </List>

                </Grid>
                <Grid item xs={12}>
                    <>Broad cast list</>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {
                            broadCastList?.length ?
                                <>
                                    {
                                        broadCastList?.map(item => {
                                            return <ListItem>
                                                <ListItemText primary={"Broad casted on"} secondary={moment(item?.createdAt).format(
                                                    'Do MMM, h a',
                                                )} />

                                                <ListItemText primary={"Center Id"} secondary={item.center_obj_id?.qr_details?.qr_id} />
                                                <ListItemText primary={"center_name"} secondary={item.center_obj_id?.center_name} />
                                                <ListItemText primary={"center_phone"} secondary={item.center_obj_id?.personal_details?.phone?.mobile_number} />
                                                <ListItemText primary={"Status of broadcast"} secondary={item?.status_of_ticket} />

                                            </ListItem>
                                        })
                                    }
                                </>
                                : "No feed back given"
                        }

                    </List>

                </Grid>

            </Grid>
        </Box>
    )
}
