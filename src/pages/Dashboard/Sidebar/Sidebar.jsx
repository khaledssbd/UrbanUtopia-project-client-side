import { useState } from 'react';
import { GrLogout } from 'react-icons/gr';
import { AiOutlineBars } from 'react-icons/ai';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import UserMenu from './Menu/UserMenu';
import MemberMenu from './Menu/MemberMenu';
import AdminMenu from './Menu/AdminMenu';
import useRole from '../../../hooks/useRole';

const Sidebar = () => {
  const { logOut } = useAuth();
  const [isActive, setActive] = useState(true);
  const [role] = useRole();

  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="flex justify-between md:hidden">
        <div>
          <div className="block cursor-pointer p-4 font-bold text-2xl md:text-3xl">
            <Link to="/">
              <button className="flex justify-center items-center gap-1">
                <img
                  className="w-8 sm:w-10 rounded-lg"
                  src="/logo.png"
                  alt="UrbanUtopia"
                />
                <span className="bg-gradient-to-r from-primary to-red-500 text-transparent bg-clip-text">
                  UrbanUtopia
                </span>
              </button>
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-green-400 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform 
        ${
          isActive && '-translate-x-full'
        }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-gray-300 mx-auto text-2xl md:text-3xl font-semibold">
              <Link to="/">
                <button className="flex justify-center items-center gap-1">
                  <img
                    className="w-8 sm:w-10 rounded-lg"
                    src="/logo.png"
                    alt="UrbanUtopia"
                  />
                  <span className="bg-gradient-to-r from-primary to-red-500 text-transparent bg-clip-text">
                    UrbanUtopia
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            {/*  Menu Items */}
            <nav>
              {role === 'user' && <UserMenu />}
              {role === 'member' && <MemberMenu />}
              {role === 'admin' && <AdminMenu />}
            </nav>
          </div>
        </div>

        <div>
          <hr />

          <button
            onClick={logOut}
            className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform"
          >
            <GrLogout className="w-5 h-5" />
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
