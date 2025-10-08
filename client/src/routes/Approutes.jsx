// Approutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components
import MainLayout from '../layout/MainLayout';
import MainDashboard from '../pages/Home/Home';
import AbstractSupport from '../pages/abstract/AbstractSupport';
import SignInPage from '../pages/mvpblocks/LoginForm';
import ProtectedRoute from './ProtectedRoute';
// import Client from '../pages/clientproject/client';
import Inbox from '../pages/contactSupport/ContactSupport';
import PaymentPage from '../pages/payment/PaymentSupport';
const Approutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<SignInPage />} />
        {/* <Route path='/client' element={<Client />} /> */}
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<MainDashboard />} /> 
            <Route path="/abstract" element={<AbstractSupport />} />
            <Route path='/inbox' element={<Inbox/>}/>
            <Route path='/payment' element={<PaymentPage/>}/>
          </Route>
        </Route>

        {/* Catch-All 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Approutes;
