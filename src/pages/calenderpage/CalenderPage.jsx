import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SideNav from "../../components/Dashboard";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AppContext } from "../../utils/AppContext";
import EventForm from "./AddEvent";
import Grid from "@mui/material/Grid2";
import EventModal from "../../components/CoompletedEventModal";

const localizer = momentLocalizer(moment);
function Calender() {
  const { client, authToken, events, setEvents, clearToken } =
    useContext(AppContext);
  const [selectedEvent, setSelectedEvent] = useState(null);

  //  completedEvent modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  // // Handle event
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    handleOpen();
    // const eventUpdate = events.map(evnt=>
    //   evnt.id === event.id ? {...evnt, completed: true}: evnt
    // )
    // setEvents(eventUpdate)
  };
  const eventStyle = (event) => {
    const style = {
      backgroundColor: event.completed ? "green" : "#3174ad",
      color: event.completed ? "#808080" : "#fff",
      border: "none",
      // cursor: event.completed ? 'no-drop': 'pointer',
    };
    return { style };
  };
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await client.get("/tasks/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("events1");
        setEvents(response.data);
      } catch (error) {
        // Handle any errors that occur during the request
        console.log(error);
        if (error.status === 401) {
          // If the user is not authenticated, redirect them to the login page
          clearToken();
          navigate("/login");
        }

        console.error(
          "Error fetching tasks:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchEvent();
  }, []);
  const boxStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: '#00FF00', // Green color
    border: '1px solid #000', // Black border
    marginRight: '5px'
  };

   
  return (
    <div>
      <SideNav />
     
      <section style={{display:'flex', justifyContent:'center'}}>

        <div style={boxStyle}></div> Completed Events
        </section>
      <Grid container spacing={2} style={{ padding: "0px 0px 0px 30px" }}>
     
        <Grid item xs={8}>
         
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor={(event) => {
              return new Date(event.start);
            }}
            endAccessor={(event) => {
              return new Date(event.end);
            }}
            style={{ height: "65vh", width: "70vw" }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyle}
          />
        </Grid>
        <Grid item xs={4}>
          <h2>Add Events</h2>
          <EventForm
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        </Grid>
      </Grid>
      <EventModal
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
        handleOpen={handleOpen}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );
}

export default Calender;
