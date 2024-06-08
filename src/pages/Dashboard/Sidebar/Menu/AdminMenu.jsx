import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';
import useRole from '../../../../hooks/useRole';
import { MdOutlineApartment } from 'react-icons/md';
import { FaListAlt } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { RiCoupon2Line } from 'react-icons/ri';
import { FaClipboardList } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
import { FaGear } from 'react-icons/fa6';


const AdminMenu = () => {
  const [role] = useRole();

  return (
    <>
      {role === 'admin' && (
        <ul className="menu p-2 space-y-2 text-black font-medium">
          <li>
            <NavLink to="/dashboard/admin-profile">
              <FaGear />
              Admin Profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/agreement-requests">
              <FaListAlt /> Agreement Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-members">
              <FaUsers />
              Manage Members
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/make-announcement">
              <HiOutlineSpeakerphone />
              Make Announcement
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-announcements">
              <FaClipboardList />
              Manage Announcements
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/add-apartment">
              <IoMdAdd />
              Add Apartment
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-apartments">
              <MdOutlineApartment />
              Manage Apartments
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-coupons">
              <RiCoupon2Line />
              Manage Coupons
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};
export default AdminMenu;
