import React, { useContext, useEffect, useState } from "react";
import SideNav from "../../components/Dashboard";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { AppContext } from "../../utils/AppContext";
import EventForm from "./AddEvent";
import Grid from '@mui/material/Grid2';
import { Padding } from "@mui/icons-material";



const localizer = momentLocalizer(moment);
function Calender() {
  const { client, authToken } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    client
      .get("/tasks/", {
        headers: {
          Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
        },
      })
      .then((response) => {
        console.log("events1", response.data);
        setEvents(response.data);
      });
  }, []);

  return (
    <div>
      <SideNav />
      <Grid container spacing={2} style={{padding: '0px 0px 0px 30px'}}>
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
        />
        </Grid>
        <Grid item xs={4}>
        <EventForm />
        </Grid>
        </Grid>
        
       
    </div>
  );
}

export default Calender;
