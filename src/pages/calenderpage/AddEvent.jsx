import React, { useContext, useEffect, useState } from "react";
import "./AddEvent.css";
import { AppContext } from "../../utils/AppContext";

function EventForm({ selectedEvent, setSelectedEvent }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const { client, authToken, events, setEvents } = useContext(AppContext);

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


  // handle submit
  // create new event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (error !== "") {
      alert("Please fix the errors before submitting the form.");
    } else {

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
          resetEventForm()
        })
        .catch((error) => {
          // Handle errors
          console.error("Error creating task:", error);
        });
    }
  };

  // handle the delete
  const hanedleDelete = (e) => {
    e.preventDefault()
    // Send a DELETE request to remov selected event
    client
      .delete(`/tasks/${selectedEvent.id}`)
      .then((response) => {
        // Handle success
        console.log("Response:", response.data);

        // update the event list by removing the selectted event 
        setEvents((prevEvents) =>
          prevEvents.filter((item) => item.id !== selectedEvent.id)
        );
        // reset event form by clearing and deselect selected event
        resetEventForm()
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  };

  // updates the event list by replacing the selected event with updated event
  const updateEvent = (updatedEvent) => {

    const updatedEvents = events.map(evt => 
    evt.id === selectedEvent.id ? updatedEvent : evt
    )

    setEvents(updatedEvents)
  }

  // handles the edit event
  const handleEdit = async (e) => {
    e.preventDefault()

    // data to be sent in the PUT request
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

    try {
      // send a put request to update event
      const response = await client.put(`/tasks/${selectedEvent.id}`, data, config);
      console.log('Response:', response.data);

      // updates the event list by replacing the selected event with updated event
      updateEvent(event_data)

     // reset event form by clearing and deselect selected event
      resetEventForm()
      
  } catch (error) {
      console.error('Error updating data:', error.response ? error.response.data : error.message);
  }

  };

  // populates the evnt form field with event details
  // if the event is selected
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      const start = splite_datetime_string(selectedEvent.start);
      const end = splite_datetime_string(selectedEvent.end);
      setDate(start.date);
      setStartTime(start.time);
      setEndTime(end.time);
    }
  }, [ selectedEvent ]);

  // reset event form by clearing all input fields
  // deselect selected event
  const resetEventForm = () => {

    setTitle("");
    setDate("");
    setEndTime("")
    setStartTime("");

    // Deselect the currently selected event
    setSelectedEvent('')
  }

  // splits datetime string into date and time
  const splite_datetime_string = (dateTimeString) => {
    const [date, time] = dateTimeString.split("T");

    // return "2024-09-01T12:30:45" becomes { date: "2024-09-01", time: "12:30:45" }.
    return { date, time }; 
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
      <div>
        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          required
        />
      </div>
      <div>
        <label>End Time:</label>
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          required
        />
      </div>
      {error !== "" && <p style={{ color: "red" }}>{error}</p>}

      <button
        type="submit"
        disabled={selectedEvent ? true : false}
        onClick={handleSubmit}
      >
        Add Event
      </button>
      <button
        className="update"
        disabled={selectedEvent ? false : true}
        onClick={handleEdit}
      >
        Edit
      </button>

      <button
        className="delete"
        disabled={selectedEvent ? false : true}
        onClick={hanedleDelete}
      >
        Delete
      </button>
    </form>
  );
}

export default EventForm;
