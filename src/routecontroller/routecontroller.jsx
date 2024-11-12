import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/login/Login'; 
import Brands from '../components/brands/Brands';
import Models from '../components/models/Models';
import Locations from '../components/loactions/Locations';
import Cities from '../components/cities/Cities';
import Cars from '../components/cars/Cars';
import PrivateRoute from './privateroutes/PrivateRoute';
import Layout from '../components/layout/Layout';
import Categories from '../components/settings/Categories';
import NotFound from '../components/notfound/Notfound';

export default function RouteController() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />  
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/models" element={<Models />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/cars" element={<Cars />} />
        </Route>
      </Route> 
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  );
}
