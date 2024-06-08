import { Outlet, ScrollRestoration } from 'react-router-dom';
import Sidebar from '../pages/Dashboard/Sidebar/Sidebar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Dashboard = () => {

  useEffect(() => {
    AOS.init({ duration: '1000' });
  }, []);
  return (


    <div className="relative min-h-screen md:flex">
      <ScrollRestoration />
      {/* Sidebar */}
      <Sidebar />

      {/* Outlet --> Dynamic content */}
      <div className="flex-1 md:ml-64">
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
