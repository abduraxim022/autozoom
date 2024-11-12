import React from 'react';
import {  Outlet, } from 'react-router-dom';
import Notlogin from '../notlogin/Notlogin';


const PrivateRoute = () => {
  const token = localStorage.getItem("authToken"); 

  return token ? (
    <Outlet /> 
  ) : (
    <Notlogin /> 
  );
};

export default PrivateRoute;
