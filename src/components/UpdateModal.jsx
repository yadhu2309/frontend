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
  width: 500,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function UpdateModal({ selectedEvent, setSelectedEvent, setOpen,open, handleClose }) {
 

  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [error, setError] = React.useState("");

  const [eventError, setEventError] = React.useState({});

  const navigate = useNavigate();

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

  // configuration for the request, including headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  // today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];


  // handles the change to the start time field
  const handleStartTimeChange = (e) => {
    const selectedStartTime = e.target.value;
    setStartTime(selectedStartTime);

    // if the end time is earlier than the start time, clear it
    if (endTime && selectedStartTime >= endTime) {
      // clear end time
      setEndTime("");
      // sets error message
      setError("End time must be later than the start time.");
    } else {
      // clear the existing error
      setError("");
    }
  };

  // handles the changes  to the end time field
  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;

    if (startTime && selectedEndTime <= startTime) {
      // sets error message
      setError("End time must be later than the start time.");
    } else {
      // update the time
      setEndTime(selectedEndTime);
      // clear the existing error
      setError("");
    }
  };

    // splits datetime string into date and time
    const splite_datetime_string = (dateTimeString) => {
        try {
          const [date, time] = dateTimeString.split("T");
          // return "2024-09-01T12:30:45" becomes { date: "2024-09-01", time: "12:30:45" }.
          return { date, time };
        } catch (error) {
         let data = extractDateTime(dateTimeString)
         return data
        }
      };
    
      const formValidation = () => {
        let newError = {};
        if (!title.trim()) {
          newError.title = "Title is required";
        }
        if (!date) {
          newError.date = "Date is required";
        }
        if (!startTime) {
          newError.startTime = "Start time is required";
        }
        if (!endTime) {
          newError.endTime = "End time is required";
        }
        setEventError(newError);
        // return false if no errors
        return Object.keys(newError).length !== 0;
      };
    
      
    
      const extractDateTime = (dateTime) => {
        const date = new Date(dateTime);
    console.log(date)
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are 0-based
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        if(isNaN(date.getTime()))
        {
          throw new Error("Invalid date-time string");
    
        }
    
        // Format date and time
        const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
        return {date: formattedDate, time: formattedTime}
      };

  // populates the evnt form field with event details
  // if the event is selected
  React.useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      let start, end
     
      // 2024-09-03T13:57:00 extract date and time
     
        console.log('useefect', selectedEvent.start)
      start = splite_datetime_string(selectedEvent.start);
      end = splite_datetime_string(selectedEvent.end);
      
      setDate(start.date);
      setStartTime(start.time);
      setEndTime(end.time);
    }
  }, [selectedEvent]);

  // updates the event list by replacing the selected event with updated event
  const updateEvent = (updatedEvent) => {
    const updatedEvents = events.map((evt) =>
      evt.id === selectedEvent.id ? updatedEvent : evt
    );

    setEvents(updatedEvents);
  };
  const resetEventForm = () => {
    setTitle("");
    setDate("");
    setEndTime("");
    setStartTime("");

    // Deselect the currently selected event
    setSelectedEvent("");
  };
  
  // handles the edit event
  const handleEdit = async (e) => {
    e.preventDefault();
    if (error !== "" || formValidation()) {
      return;
    }

    // data to be sent in the PUT request
    const data = {
      title: title,
      date: date,
      start: startTime,
      end: endTime,
    };

    // event data for updating the event state
    const event_data = {
      id: selectedEvent.id,
      date: data.date,
      title: data.title,
      start: new Date(`${data.date} ${data.start}` + ":00"),
      end: new Date(`${data.date} ${data.end}` + ":00"),
    };

    try {
      // send a put request to update event
      const response = await client.put(
        `/tasks/${selectedEvent.id}`,
        data,
        config
      );

      console.log("Response:");
       // toast message showing
       setSnackbarOpen(true)
       // snackbar message
       setSnackbarMessage(`Event updated successfully`);

      // updates the event list by replacing the selected event with updated event
      updateEvent(event_data);

      // reset event form by clearing and deselect selected event
      resetEventForm();
      handleClose()

    } catch (error) {
      console.error(
        "Error updating data:",
        error.response ? error.response.data : error.message
      );
      if (error.status === 404) {
        alert("Event not found");
      } else if (error.status === 401) {
        clearToken();
        navigate("/login");
      }
    }
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
            Edit Event
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <form>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      {eventError.title && <p className="error-message">{eventError.title}</p>}
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          min={today}
        />
      </div>
      {eventError.date && <p className="error-message">{eventError.date}</p>}

      <div>
        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          required
        />
      </div>
      {eventError.startTime && (
        <p className="error-message">{eventError.startTime}</p>
      )}

      <div>
        <label>End Time:</label>
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          required
        />
      </div>
      {eventError.endTime && (
        <p className="error-message">{eventError.endTime}</p>
      )}

      {error !== "" && <p className="error-message">{error}</p>}

    
      

      <button
        type='submit'
        onClick={handleEdit}
      >
        Save
      </button>
    </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}