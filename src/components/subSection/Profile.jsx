import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Avatar,
    Divider,
    Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ProfileComponent = ({ onClose, userDetails }) => {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    function getCurrentTime() {
        const date = new Date();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box sx={{ height: '100%' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2
            }}>
                <Typography variant="h6" fontWeight="bold">
                    Profile
                </Typography>
                <IconButton color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{
                position: 'relative',
                backgroundColor: '#808080',
                p: 2,
                height: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white'
                    }}
                >
                    Upload photo
                </Button>
                <Avatar
                    src={userDetails?.avatar}
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'white',
                        mb: 2
                    }}
                >
                    {!userDetails?.avatar && userDetails?.fullName?.charAt(0)}
                </Avatar>
            </Box>

            <Box sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5">
                        {userDetails?.fullName || "Ayush Tiwari"}
                    </Typography>
                    <Button
                        sx={{
                            color: '#4dabf5',
                            minWidth: 'auto',
                            p: 0,
                            textTransform: 'none'
                        }}
                    >
                        Edit
                    </Button>
                </Box>

                <Button
                    startIcon={<AddIcon />}
                    sx={{
                        color: '#4dabf5',
                        p: 0,
                        mb: 2,
                        textTransform: 'none'
                    }}
                >
                    Add name pronunciation
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Badge
                        variant="dot"
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: '#4caf50',
                                marginRight: 1
                            }
                        }}
                    />
                    <Typography sx={{ ml: 1 }}>
                        Active
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography>
                        {currentTime} local time
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            textTransform: 'none'
                        }}
                    >
                        Set a status
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            minWidth: '120px',
                            textTransform: 'none'
                        }}
                        endIcon={<ExpandMoreIcon />}
                    >
                        View as
                    </Button>
                    <IconButton
                        sx={{
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            border: '1px solid',
                            borderRadius: 1
                        }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Box>

            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                        Contact information
                    </Typography>
                    <Button
                        sx={{
                            color: '#4dabf5',
                            minWidth: 'auto',
                            p: 0,
                            textTransform: 'none'
                        }}
                    >
                        Edit
                    </Button>
                </Box>



                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon fontSize="small" sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="body2" color="white" sx={{ opacity: 0.7 }}>
                                Email address
                            </Typography>
                            <Typography variant="body2" color="white">
                                {userDetails?.email || "ayush.tiwari@parkhya.net"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="body2" color="white" sx={{ opacity: 0.7 }}>
                                Phone number
                            </Typography>
                            <Typography variant="body2" color="white">
                                {userDetails?.mobileNumber || "0000000kkgk0000"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>



            </Box>

            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                        About me
                    </Typography>
                    <Button
                        sx={{
                            color: '#4dabf5',
                            minWidth: 'auto',
                            p: 0,
                            textTransform: 'none'
                        }}
                    >
                        Edit
                    </Button>
                </Box>

            
            </Box>
        </Box>
    );
};

export default ProfileComponent;
