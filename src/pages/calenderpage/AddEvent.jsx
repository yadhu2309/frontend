import React, { useState } from 'react';
import './AddEvent.css'

function EventForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const handleStartTimeChange = (e) => {
    const selectedStartTime = e.target.value;
    setStartTime(selectedStartTime);

    // If the end time is earlier than the start time, clear it
    if (endTime && selectedStartTime >= endTime) {
      setEndTime('');
      setError('End time must be later than the start time.');
    } else {
      setError('');
    }
  };

  const handleEndTimeChange = (e) => {

    const selectedEndTime = e.target.value;
    console.log(startTime && selectedEndTime <= startTime, selectedEndTime, startTime)

    if (startTime && selectedEndTime <= startTime) {
    setError('End time must be later than the start time.');
    } else {
      setEndTime(selectedEndTime);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error !== '') {
      alert('Please fix the errors before submitting the form.');
    } else {
      // Process the form data
      console.log({ startTime, endTime });
    }
    
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
        //   disabled={!startTime} // Disable end time input until a start time is selected

        />
      </div>
      {error !== '' && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" onClick={handleSubmit}>Add Event</button>
    </form>
  );
}

export default EventForm;
