import React from 'react'
import RouteController from './routecontroller/routecontroller'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/sidebar/Sidebar';
import './style/main.scss'


export default function App() {
  return (
    <div className='container'>
      <ToastContainer />
        <RouteController/>
     
        
        
    </div>
  )
}
