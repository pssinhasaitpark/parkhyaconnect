import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ListItemIcon,
  Checkbox
} from "@mui/material";
import { Close, PersonAdd } from "@mui/icons-material";
import { sendChannelMessage, fetchAvailableUsers, addMemberToChannel } from "../../redux/channelsSlice";

const ChannelDetailsModal = ({ open, onClose, channel }) => {
  const dispatch = useDispatch();
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const availableUsers = useSelector((state) => state.channels.availableUsers);
  const error = useSelector((state) => state.channels.error);

  useEffect(() => {
    if (addMembersOpen) {
      dispatch(fetchAvailableUsers());
    }
  }, [addMembersOpen, dispatch]);

  const handleUserSelect = (user) => {
    setSelectedUsers((prev) => {
      if (prev.includes(user.id)) {
        return prev.filter((id) => id !== user.id);
      }
      return [...prev, user.id];
    });
  };

  const handleAddMembers = async () => {
    try {
      const addedUserNames = [];

      for (const userId of selectedUsers) {
        const result = await dispatch(addMemberToChannel({ channelId: channel.id, userId })).unwrap();
        addedUserNames.push(result.member.fullName);
      }

      if (addedUserNames.length > 0) {
        const messageContent = `${addedUserNames.join(", ")} ${addedUserNames.length > 1 ? 'have' : 'has'} joined the channel.`;
        await dispatch(sendChannelMessage({
          channelId: channel.id,
          content: messageContent
        })).unwrap();
      }

      setSelectedUsers([]);
      setAddMembersOpen(false);
    } catch (err) {
      console.error("Failed to add members:", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '500px',
          bgcolor: '#290b2c',
          color: 'white',
          borderRadius: 2,
          p: 3,
          outline: 'none'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Channel Details</Typography>
          <IconButton onClick={onClose}>
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1"># {channel.name}</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {channel.datadescription || 'No description'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Channel Type</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.2)',
              px: 1,
              borderRadius: 1,
              width: 'fit-content'
            }}
          >
            {channel.isPrivate ? 'Private Channel' : 'Public Channel'}
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Created By</Typography>
          <Typography variant="body2">{channel.createdBy || 'Unknown'}</Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">Members ({channel.members?.length || 0})</Typography>
            <Button
              startIcon={<PersonAdd />}
              sx={{ color: 'white' }}
              onClick={() => setAddMembersOpen(true)}
            >
              Add Members
            </Button>
          </Box>
        </Box>

        {/* Add Members Dialog */}
        <Dialog
          open={addMembersOpen}
          onClose={() => setAddMembersOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: '#290b2c',
              color: 'white'
            }
          }}
        >
          <DialogTitle>Add Members</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search members"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                },
              }}
            />
            <List>
              {Array.isArray(availableUsers) && availableUsers.map((user) => (
                <ListItem key={user.id} button onClick={() => handleUserSelect(user)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedUsers.includes(user.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={user.fullName} />
                </ListItem>
              ))}
            </List>
            {error && <Typography color="error">{error}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddMembersOpen(false)} sx={{ color: 'white' }}>
              Cancel
            </Button>
            <Button onClick={handleAddMembers} sx={{ color: 'white' }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default ChannelDetailsModal;