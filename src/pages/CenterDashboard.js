import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function CenterDashboard() {

    const globalState = useSelector((state) => state.userReducer);

    return (
        <>

            <Card sx={{ maxWidth: 345 }} style={{ marginBottom: "50px" }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image="https://cdn-icons-png.flaticon.com/512/51/51372.png"
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Personal Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Phone number :- " + globalState?.centerDetailsPopulated?.personal_details?.phone?.mobile_number
                            }
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Center name :- " + globalState?.centerDetailsPopulated?.center_name
                            }
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Number of technicians :- " + globalState?.centerDetailsPopulated?.no_of_technicians
                            }
                        </Typography>


                    </CardContent>
                </CardActionArea>
            </Card>
            <Card sx={{ maxWidth: 345 }} style={{ marginBottom: "50px" }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image="https://thumbs.dreamstime.com/b/address-icon-information-sign-address-icon-faq-help-hint-symbol-vector-icon-address-icon-information-sign-112676342.jpg"
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Address details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Address line :- " + globalState?.centerDetailsPopulated?.address_details?.address_line
                            }
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Pin code :- " + globalState?.centerDetailsPopulated?.address_details?.pincode
                            }
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            {
                                "City :- " + globalState?.centerDetailsPopulated?.address_details?.city
                            }
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            {
                                "State :- " + globalState?.centerDetailsPopulated?.address_details?.state
                            }
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Country :- " + globalState?.centerDetailsPopulated?.address_details?.country
                            }
                        </Typography>


                    </CardContent>
                </CardActionArea>
            </Card>

            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image="https://www.kindpng.com/picc/m/750-7505601_services-icon-png-services-icon-transparent-png.png"
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Services Providing
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Primary service :- " + globalState?.centerDetailsPopulated?.services?.primary_services?.service_name
                            }
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                            {
                                "Secondary service :- " + globalState?.centerDetailsPopulated?.services?.secondary_services?.map(ite => ite?.secondary_services_id?.service_name).join(',')
                            }
                        </Typography>
                        <br />


                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}
