import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

const style = {
    flex: 1,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const stylesCss = {
    inputBox: {
        width: '100%',

    },
    dialogInputBox: {
        height: 70,
        padding: 10,
        width: 300,

    },
    gridStyle: {

    },
    paddingInnerGrids: {
        paddingRight: "10px",
        paddingLeft: "10px",
        paddingTop: "10px",
        margin: 10,
        justifyContent: "center"
    },
    dialogAlignBox: {

    }

}


export default function ViewTicketFeedBack({
    open,
    handleClose,
    viewfeedback
}) {

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {
                            viewfeedback?.length ? viewfeedback?.map(ite => {
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

                </Box >
            </Modal >

        </div >
    )
}