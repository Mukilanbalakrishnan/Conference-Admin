import React from 'react'
import { Outlet } from 'react-router-dom';
import SideNavbar from '../components/Navbar';
import Header from '../components/Header';
const MainLayout = () => {    
    return (
        <div className="relative min-h-screen bg-gray-50">
            <SideNavbar/>
            <main className='absolute top-0 left-0 w-full lg:pl-64 min-h-screen'>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
