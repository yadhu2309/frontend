import React, { useContext } from 'react'
import { AppContext } from './AppContext'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
    const { authToken } = useContext(AppContext)
    if(!authToken){
        return <Navigate to='/login'/>
    }

  return (
   children
  )
}
