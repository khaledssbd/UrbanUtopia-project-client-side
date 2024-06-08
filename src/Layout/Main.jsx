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
      <div className="max-w-screen-xl mx-auto text-center font-fira px-3 sm:px-5 md:px-8 lg:px-12 xl:px-0">
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
