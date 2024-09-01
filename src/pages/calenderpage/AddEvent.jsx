import React, { useContext, useEffect, useState } from "react";
import "./AddEvent.css";
import { AppContext } from "../../utils/AppContext";
import { useNavigate } from "react-router-dom";

function EventForm({ selectedEvent, setSelectedEvent }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const [eventError, setEventError] = useState({});

  const navigate = useNavigate();

  const { client, authToken, events, setEvents, clearToken } =
    useContext(AppContext);

  // configuration for the request, including headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  // today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

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

  // handle submit
  // create new event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (error !== "" || formValidation()) {
      return;
      // alert("Please fix the errors before submitting the form.");
    } else {
      setEventError({});

      // data to be sent in the POST request
      const data = {
        title: title,
        date: date,
        start: startTime,
        end: endTime,
      };

      // event data for updating the event state
      const event_data = {
        title: data.title,
        start: new Date(`${data.date} ${data.start}` + ":00"),
        end: new Date(`${data.date} ${data.end}` + ":00"),
      };

      // Making the POST request
      client
        .post("/tasks/", data, config)
        .then((response) => {
          // Handle the response data
          console.log("Task created successfully:", response.data);
          setEvents([...events, event_data]);

          // reset event form by clearing and deselect selected event
          resetEventForm();
        })
        .catch((error) => {
          // Handle errors
          console.error("Error creating task:", error);
          if (error.status === 401) {
            // If the user is not authenticated, redirect them to the login page
            clearToken();
            navigate("/login");
          }
        });
    }
  };

  // reset event form by clearing all input fields
  // deselect selected event
  const resetEventForm = () => {
    setTitle("");
    setDate("");
    setEndTime("");
    setStartTime("");

    // Deselect the currently selected event
    setSelectedEvent("");
  };

  return (
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
        type="submit"
        onClick={handleSubmit}
      >
        Add Event
      </button>
      
    </form>
  );
}

export default EventForm;
