import React, { useContext, useEffect, useState } from "react";
import SideNav from "../../components/Dashboard";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { AppContext } from "../../utils/AppContext";
import EventForm from "./AddEvent";
import Grid from "@mui/material/Grid2";
import { Padding } from "@mui/icons-material";

const localizer = momentLocalizer(moment);
function Calender() {
  const { client, authToken, events } = useContext(AppContext);
  const [selectedEvent, setSelectedEvent] = useState(null);

 // Handle event selection
 const handleSelectEvent = (event) => {
  setSelectedEvent(event);
  console.log('Selected event:', event);
};
  return (
    <div>
      <SideNav />
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

          />
        </Grid>
        <Grid item xs={4}>
          <EventForm selectedEvent={ selectedEvent } set
           />
        </Grid>
      </Grid>
    </div>
  );
}

export default Calender;
