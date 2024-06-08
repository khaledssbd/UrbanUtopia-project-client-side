import useAuth from '../../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import userImg from '../../../assets/user.png';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import MOON from '../../../assets/moon.svg';
import SUN from '../../../assets/sun.svg';
import useRole from '../../../hooks/useRole';

const NavBar = () => {
  const { user, logOut, loading } = useAuth();
  const [role, isRoleLoading] = useRole();

  console.log(role, isRoleLoading);

  // theme change part start
  const [theme, setTheme] = useState();
  useEffect(() => {
    const localTheme = localStorage.getItem('UrbanUtopia-theme');
    if (localTheme) {
      setTheme(localTheme);
      document.querySelector('html').setAttribute('data-theme', localTheme);
    } else {
      setTheme('light');
      localStorage.setItem('UrbanUtopia-theme', 'light');
      document.querySelector('html').setAttribute('data-theme', 'light');
    }
  }, []);

  const handleToggle = () => {
    const localTheme = localStorage.getItem('UrbanUtopia-theme');
    if (localTheme === 'light') {
      setTheme('synthwave');
      localStorage.setItem('UrbanUtopia-theme', 'synthwave');
      document.querySelector('html').setAttribute('data-theme', 'synthwave');
      return;
    }
    setTheme('light');
    localStorage.setItem('UrbanUtopia-theme', 'light');
    document.querySelector('html').setAttribute('data-theme', 'light');
  };
  // theme change part end

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success('You logged out successfully!');
      })
      .catch(error => toast.error(error));
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'font-bold border-2 border-green-500 mr-2'
              : 'font-bold hover:text-red-500 mr-2'
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-apartments"
          className={({ isActive }) =>
            isActive
              ? 'font-bold border-2 border-green-500 mr-2'
              : 'font-bold hover:text-red-500 mr-2'
          }
        >
          Apartments
        </NavLink>
      </li>
    </>
  );

  if (loading || isRoleLoading)
    return <span className="loading loading-bars loading-md"></span>;

  return (
    <div className="navbar fixed z-20 bg-opacity-30 bg-black text-white max-w-screen-xl">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-black"
          >
            {navLinks}
          </ul>
        </div>
        <Link
          to="/"
          className="btn -ml-6 sm:-ml-0 btn-ghost hover:bg-black hover:text-black text-2xl sm:text-3xl font-bold"
        >
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
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>
      <div className="navbar-end">
        {/* Dark theme toggle */}
        {theme === 'light' ? (
          <img
            onClick={handleToggle}
            className="w-10"
            src={MOON}
            alt="UrbanUtopia"
          />
        ) : (
          <img
            onClick={handleToggle}
            className="w-10"
            src={SUN}
            alt="UrbanUtopia"
          />
        )}
        {/* User image part */}
        {user ? (
          <>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="m-1 btn btn-ghost btn-circle avatar hover:bg-blue-700"
              >
                <div
                  className="w-10 rounded-full"
                  data-tooltip-id="userName"
                  data-tooltip-content={
                    user?.displayName ? user?.displayName : 'No Name Set Yet'
                  }
                  data-tooltip-place="left"
                >
                  <img
                    src={user?.photoURL || userImg}
                    referrerPolicy="no-referrer"
                    alt="User Profile Picture"
                  />

                  <Tooltip id="userName" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-36 -ml-20 bg-black"
              >
                <li className="bg-green-500 font-bold text-left px-4 py-2 rounded-sm">
                  {user?.displayName}
                </li>
                {role === 'user' && (
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:bg-blue-700 hover:text-white font-bold"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                {role === 'member' && (
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:bg-blue-700 hover:text-white font-bold"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                {role === 'admin' && (
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:bg-blue-700 hover:text-white font-bold"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    onClick={handleLogOut}
                    className="hover:bg-red-700 hover:text-white font-bold"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>

            {/* <button
              onClick={handleLogOut}
              className="hidden sm:flex btn btn-outline bg-red-500 hover:bg-red-900 text-white px-2"
            >
              Log Out
            </button> */}
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn btn-outline bg-blue-600 hover:bg-black text-white hover:text-white ml-3">
                Login
              </button>
            </Link>
            {/* <Link to="/register">
              <button className="btn btn-outline bg-blue-600 hover:bg-black text-white hover:text-white hidden sm:flex">
                Register
              </button>
            </Link> */}
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
