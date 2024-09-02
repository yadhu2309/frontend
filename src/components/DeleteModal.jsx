import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AppContext } from '../utils/AppContext';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from "@mui/material";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteConfirmModal({open, setOpen, handleClose, handleOpen, selectedEvent, setSelectedEvent}) {
    const { client, authToken, events, setEvents, clearToken } =
    React.useContext(AppContext);

     //snackbar open
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  // snackbar message
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  // snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };
    
const navigate = useNavigate()
    // configuration for the request, including headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

// handle the delete
const hanedleDelete = async (e) => {
    e.preventDefault();
    // Send a DELETE request to remov selected event
    await client
      .delete(`/tasks/${selectedEvent.id}`, config)

      .then((response) => {
        // Handle success
        console.log("deleted successfully");
         // toast message showing
      setSnackbarOpen(true)
      // snackbar message
      setSnackbarMessage("Event Deleted successfully");

        // update the event list by removing the selectted event
        setEvents((prevEvents) =>
          prevEvents.filter((item) => item.id !== selectedEvent.id)
        );
        setSelectedEvent(null)
        handleClose()
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
        if (error.status === 404) {
          alert("Event not found");
        } else if (error.status === 401) {
          clearToken();
          navigate("/login");
        }
      });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        key={'top' + 'center'}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Event
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are sure you want to delete the event '{selectedEvent&&selectedEvent.title}'?        
        </Typography>
        <div style={{ display: 'flex', justifyContent:'end'}}>

      <button className='delete'
        // disabled={selectedEvent ? false : true}
        onClick={handleClose}
      >
        No
      </button>
        <button className='update'
        // disabled={selectedEvent ? false : true}
        onClick={hanedleDelete}
      >
        Yes
      </button>
        </div>

        </Box>
      </Modal>
    </div>
  );
}
