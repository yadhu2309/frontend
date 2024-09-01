import React, { useContext, useEffect, useState } from "react";
import "./AddEvent.css";
import { AppContext } from "../../utils/AppContext";

function EventForm({ selectedEvent }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const { client, authToken, events, setEvents } = useContext(AppContext);

   // Configuration for the POST request, including headers
   const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleStartTimeChange = (e) => {
    const selectedStartTime = e.target.value;
    setStartTime(selectedStartTime);

    // If the end time is earlier than the start time, clear it
    if (endTime && selectedStartTime >= endTime) {
      setEndTime("");
      setError("End time must be later than the start time.");
    } else {
      setError("");
    }
  };

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    console.log(
      startTime && selectedEndTime <= startTime,
      selectedEndTime,
      startTime
    );

    if (startTime && selectedEndTime <= startTime) {
      setError("End time must be later than the start time.");
    } else {
      setEndTime(selectedEndTime);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error !== "") {
      alert("Please fix the errors before submitting the form.");
    } else {
      // Process the form data
      console.log({ startTime, endTime });

      // Data to be sent in the POST request
      const data = {
        title: title,
        date: date,
        start: startTime,
        end: endTime,
      };
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
        })
        .catch((error) => {
          // Handle errors
          console.error("Error creating task:", error);
        });
    }
  };
  const hanedleDelete = () => {
    // Send a DELETE request
    client
      .delete(`/tasks/${selectedEvent.id}`)
      .then((response) => {
        // Handle success
        console.log("Response:", response.data);
        setEvents((prevEvents) =>
          prevEvents.filter((item) => item.id !== selectedEvent.id)
        );
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  };

  const updateEvent = (updatedEvent) => {

    const updatedEvents = events.map(evt => 
    evt.id === selectedEvent.id ? updatedEvent : evt
    )

    setEvents(updatedEvents)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    // Data to be sent in the PUT request
    const data = {
      title: title,
      date: date,
      start: startTime,
      end: endTime,
    };

    const event_data = {
      title: data.title,
      start: new Date(`${data.date} ${data.start}` + ":00"),
      end: new Date(`${data.date} ${data.end}` + ":00"),
    };

    try {
      const response = await client.put(`/tasks/${selectedEvent.id}`, data, config);
      console.log('Response:', response.data);
      updateEvent(event_data)
  } catch (error) {
      console.error('Error updating data:', error.response ? error.response.data : error.message);
  }
    console.log("edit", data);

  };

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      const start = splite_datetime_string(selectedEvent.start);
      const end = splite_datetime_string(selectedEvent.end);
      setDate(start.date);
      setStartTime(start.time);
      setEndTime(end.time);
    }
  }, [selectedEvent]);

  const splite_datetime_string = (dateTimeString) => {
    const [date, time] = dateTimeString.split("T");
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
