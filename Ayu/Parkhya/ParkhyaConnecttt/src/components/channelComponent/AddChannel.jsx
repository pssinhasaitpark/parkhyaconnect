// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
//   Button,
//   FormControlLabel,
//   Switch,
// } from "@mui/material";

// const AddChannel = ({ open, onClose, onAddChannel }) => {
//   const [channelData, setChannelData] = useState({
//     name: "",
//     description: "",
//     isPrivate: false,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setChannelData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSwitchChange = (e) => {
//     setChannelData((prev) => ({ ...prev, isPrivate: e.target.checked }));
//   };

//   const handleSubmit = () => {
//     onAddChannel(channelData);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Add New Channel</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Channel Name"
//           name="name"
//           fullWidth
//           margin="dense"
//           variant="outlined"
//           value={channelData.name}
//           onChange={handleChange}
//         />
//         <TextField
//           label="Description"
//           name="description"
//           fullWidth
//           margin="dense"
//           variant="outlined"
//           value={channelData.description}
//           onChange={handleChange}
//         />
//         <FormControlLabel
//           control={<Switch checked={channelData.isPrivate} onChange={handleSwitchChange} />}
//           label="Private Channel"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} color="primary" variant="contained">
//           Add Channel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddChannel;



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createChannel } from "../../redux/channelSlice"; // Update the path as needed

const AddChannel = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.channel);

  const [channelData, setChannelData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChannelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setChannelData((prev) => ({ ...prev, isPrivate: e.target.checked }));
  };

  const handleSubmit = async () => {
    await dispatch(createChannel(channelData));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Channel</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Channel Name"
          name="name"
          fullWidth
          margin="dense"
          variant="outlined"
          value={channelData.name}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          variant="outlined"
          value={channelData.description}
          onChange={handleChange}
        />
        <FormControlLabel
          control={<Switch checked={channelData.isPrivate} onChange={handleSwitchChange} />}
          label="Private Channel"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Add Channel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddChannel;
