import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';
import useRole from '../../../../hooks/useRole';
import { FaGear } from 'react-icons/fa6';
const UserMenu = () => {
  const [role] = useRole();

  return (
    <>
      {role === 'user' && (
        <ul className="menu p-2 space-y-2 text-black font-medium">
          <li>
            <NavLink to="/dashboard/user-profile">
              <FaGear /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/announcements">
              <HiOutlineSpeakerphone /> Announcements
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

export default UserMenu;
