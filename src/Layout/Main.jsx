import { Outlet, ScrollRestoration } from 'react-router-dom';
import Footer from '../pages/Shared/Footer/Footer';
import NavBar from '../pages/Shared/NavBar/NavBar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Main = () => {
  useEffect(() => {
    AOS.init({ duration: '1000' });
  }, []);

  return (
    <>
      <div className="max-w-screen-xl mx-auto text-center font-fira">
        <ScrollRestoration />
        <NavBar />
        <div className="min-h-[calc(100vh-270px)]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Main;
