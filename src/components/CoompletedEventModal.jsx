import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { AppContext } from "../utils/AppContext";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EventModal({
  open,
  setOpen,
  handleClose,
  handleOpen,
  selectedEvent,
  setSelectedEvent,
}) {
    const { client, authToken, events, setEvents, clearToken } = React.useContext(AppContext)
    const navigate = useNavigate()
    // configuration for the request, including headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  const handleConfirm = async () => {
    // data to send the patch request
    let data = {
        completed: true
    }
    try{
        // send a patch request the server
        const response = await client.patch(`/tasks/${selectedEvent.id}`, data, config);
        
        const eventUpdate = events.map((evnt) =>
            evnt.id === selectedEvent.id ? { ...evnt, completed: true } : evnt
          );
          // update the the event with the existing events
          setEvents(eventUpdate);

          // close the modal
          handleClose()

          // deselecting the selected event
          setSelectedEvent(null)

    }catch(error){
        console.error(error);

        if (error.status === 401) {
            // If the user is not authenticated, redirect them to the login page
            clearToken();
            navigate("/login");
          }else if (error.status === 404) {
            alert("Event not found");
          } 
    }
    
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Event Completion
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Have you completed or attended the event '{selectedEvent&&selectedEvent.title}'
          </Typography>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <button
              className="delete"
              // disabled={selectedEvent ? false : true}
              onClick={handleClose}
            >
              No
            </button>
            <button
              className="update"
              // disabled={selectedEvent ? false : true}
              onClick={handleConfirm}
            >
              Yes
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
