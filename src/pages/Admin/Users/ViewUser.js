import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '65%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '80%',
    overflowY: 'scroll'
};

const styleListDivider = {
    width: '100%',
    maxWidth: '100%',
    bgcolor: 'background.paper',
};

const styleListItem = {
    textAlignLeft: {
        textAlign: 'left'
    },
    textAlignEnd: {
        textAlign: 'end'
    }
}

const ListDividers = ({ roleObject }) => {
    console.log("roleObject is", roleObject)

    return (
        <List sx={styleListDivider} component="nav" aria-label="mailbox folders">
            {Object.keys(roleObject).map((key) => (

                <div>
                    <ListItem button>

                        <ListItemText sx={styleListItem.textAlignLeft}>{key}</ListItemText>
                        {/* <ListItemText>{(roleObject[key]).toString()}</ListItemText> */}
                        <ListItemText sx={styleListItem.textAlignEnd}>
                            {(roleObject[key]) ?
                                <IconButton color="success">
                                    <CheckCircleIcon />
                                </IconButton> :
                                <IconButton color="error">
                                    <CancelIcon />
                                </IconButton>}
                        </ListItemText>


                    </ListItem>
                    <Divider />
                </div>
            ))}

        </List>
    );
}
export default function ViewUser({ isViewRoleOpen, handleCloseViewRole, roleObject }) {



    return (
        <div>
            <Modal
                open={isViewRoleOpen}
                onClose={handleCloseViewRole}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2>Permissions</h2>
                    <ListDividers roleObject={roleObject} />
                </Box>

            </Modal>
        </div>
    );
}