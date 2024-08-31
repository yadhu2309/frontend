import React, { useEffect, useState } from "react";
import SideNav from "../components/Dashboard";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);
function Calender() {
const[events, setEvents] = useState([])
  // const startTime = new Date(2024, 7, 24, 10, 33, 30, 0);
  // const events = [
  //   {
  //     title: "Morning Meeting",
  //     // date: '30-08-2024',      // Date in DD-MM-YYYY format
  //     start: startTime, // Start time in HH:MM format
  //     end: moment(startTime).add(1, "hours").toDate(), // End time in HH:MM format.add
  //   },
  // ];
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/tasks/")
      .then((response) => {
        console.log("events1", response.data)
        setEvents(response.data)
        

      });
      
  }, []);

  return (
    <div>
      <SideNav />
      {events&&console.log('events', events)}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "50vh", width: "50vw" }}
      />
    </div>
  );
}

export default Calender;
