import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useHistory } from "react-router-dom"
import { setLoginDetails, setLogoutDetails } from '../../store/UserStore/action'
import { useSelector, useDispatch } from 'react-redux'

const drawerWidth = 240;

let drawerItemsResponsive = [
    {
        name: 'Dashboard',
        path: '/center-dashboard'
    },
    {
        name: 'Technicians',
        path: '/Technicians'
    },
    {
        name: 'Tickets',
        path: '/tickets-center'
    },
    {
        name: 'AddTechnician',
        path: '/AddTechnician'
    },
    {
        name: 'Ticket created by you and broadcasted',
        path: '/ticket-created-by-you'
    },
    {
        name: 'AddTicket',
        path: '/AddTicket'
    }, {
        name: 'New Tickets',
        path: '/brodcast-requests'
    }, {
        name: 'Payments',
        path: '/payments'
    }
]

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const globalState = useSelector((state) => state.userReducer)

    const history = useHistory()
    const dispatch = useDispatch()


    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {drawerItemsResponsive.map((text, index) => (
                    <ListItem onClick={() => {

                        history.push(text.path)

                    }} button key={text.name}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text.name} />
                    </ListItem>
                ))}

                <ListItem onClick={() => {

                    onClickLogout()

                }} button>
                    <ListItemIcon>
                        {<InboxIcon />}
                    </ListItemIcon>
                    <ListItemText primary={"Logout"} />
                </ListItem>
            </List>
        </div>
    );

    const onClickLogout = () => {
        dispatch(
            setLoginDetails({
                userDetails: {},
                isUserLoggedIn: false,
                userTokens: {
                    accessToken: "",
                },
            }),
        )

        history.push("/login")
    }

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Welcome {globalState.userDetails.center_name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;
