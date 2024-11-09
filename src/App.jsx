import React from 'react'
import RouteController from './routecontroller/routecontroller'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/sidebar/Sidebar';


export default function App() {
  return (
    <div>
      <ToastContainer />
        <RouteController/>
     
        
        
    </div>
  )
}
