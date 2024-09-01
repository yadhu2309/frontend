import React, { useContext } from 'react'
import SideNav from '../components/Dashboard'
import { AppContext } from '../utils/AppContext';


export default function Homepage() {
  const { setEvents } = useContext(AppContext)
  useEffect(() => {
    const fetchEvent = async () => {
      
    try{
      const response = await client.get("/tasks/", {
      headers: {
        Authorization: `Bearer ${authToken}`, 
        },
      })
      console.log("events1", response.data);
      setEvents(response.data);
    }catch(error){
      // Handle any errors that occur during the request
      console.error("Error fetching tasks:", error.response ? error.response.data : error.message);
    }
    
      
    }
    fetchEvent();
  }, []);

  return (
    <div>
    {/* <DashboardLayoutBasic /> */}
    <SideNav/>
    {/* <DashboardLayout /> */}
    <h1>Homepage</h1>

    </div>
  )
}
