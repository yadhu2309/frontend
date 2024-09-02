import React, { useContext, useEffect } from 'react'
import SideNav from '../components/Dashboard'
import Table from '../components/Table'
import { AppContext } from '../utils/AppContext';
import { useNavigate } from 'react-router-dom';


export default function Homepage() {
const navigate = useNavigate()
  const { setEvents, client, authToken, events, clearToken } = useContext(AppContext)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await client.get("/tasks/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
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
  

  return (
    <div>
    <SideNav/>
    <Table rows={events}/>

    </div>
  )
}
