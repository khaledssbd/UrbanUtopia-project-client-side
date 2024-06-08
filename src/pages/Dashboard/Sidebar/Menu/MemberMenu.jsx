import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';
import useRole from '../../../../hooks/useRole';
import { FaListAlt } from 'react-icons/fa';
import { FaGear, FaHandHoldingDollar } from 'react-icons/fa6';

const MemberMenu = () => {
  const [role] = useRole();

  return (
    <>
      {role === 'member' && (
        <ul className="menu p-2 space-y-2 text-black font-medium">
          <li>
            <NavLink to="/dashboard/member-profile">
              <FaGear /> My Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/make-payment">
              <FaHandHoldingDollar /> Make Payment
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/payment-history">
              <FaListAlt />
              Payment History
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/announcements">
              <HiOutlineSpeakerphone />
              Announcements
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

export default MemberMenu;
