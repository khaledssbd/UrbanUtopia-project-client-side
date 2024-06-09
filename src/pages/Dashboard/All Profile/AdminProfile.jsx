import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaDollarSign } from 'react-icons/fa';
import { IoPeople } from 'react-icons/io5';
import userImg from '../../../assets/user.png';
import { Link } from 'react-router-dom';
import { FaKey } from 'react-icons/fa6';
import { BsBank } from 'react-icons/bs';
import {
  PiBuildingApartmentLight,
  PiBuildingApartmentFill,
  PiBuildingApartmentBold,
} from 'react-icons/pi';

const AdminProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/admin-stats?email=${user.email}`
      );
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-3xl text-center mt-16">
        Hi, Welcome {user.displayName ? user.displayName : 'Back'} (Admin/Owner)
      </h2>

      <div className="text-center">
        <div className="stats shadow my-5">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <PiBuildingApartmentBold className="text-3xl" />
            </div>
            <div className="stat-title">Total Apartments</div>
            <div className="stat-value">{stats.totalApartments}</div>
            <div className="stat-desc">Jan 1st - Today</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <PiBuildingApartmentLight className="text-3xl" />
            </div>
            <div className="stat-title">Available Apartments</div>
            <div className="stat-value">
              {stats.availableApartmentsPercent}%
            </div>
            <div className="stat-desc">Jan 1st - Today</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <PiBuildingApartmentFill className="text-3xl" />
            </div>
            <div className="stat-title">Unavailable Apartments</div>
            <div className="stat-value">
              {stats.unavailableApartmentsPercent}%
            </div>
            <div className="stat-desc">Jan 1st - Today</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaDollarSign className="text-4xl" />
            </div>
            <div className="stat-title">Revenue</div>
            <div className="stat-value">${stats.revenue}</div>
            <div className="stat-desc">Jan 1st - Today</div>
          </div>
        </div>
        <div className="stats shadow my-5">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoPeople className="text-4xl" />
            </div>
            <div className="stat-title">Users</div>
            <div className="stat-value">{stats.userCount}</div>
            <div className="stat-desc">Jan 1st - Today</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaKey className="text-4xl" />
            </div>
            <div className="stat-title">Members</div>
            <div className="stat-value">{stats.memberCount}</div>
            <div className="stat-desc">Jan 1st - Today</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <BsBank className="text-3xl" />
            </div>
            <div className="stat-title">Total Payments</div>
            <div className="stat-value">{stats.totalPayments}</div>
            <div className="stat-desc">
              {stats.isPaymentGrowing ? 'Growing ↗︎' : 'Not Growing ↘︎'}
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-3/4 lg:w-1/2 mx-auto">
        <div className="flex justify-center items-center my-10">
          <img
            className="rounded-full w-48 h-48"
            src={user?.photoURL || userImg}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-2 ml-14 sm:ml-36 md:ml-40 lg:ml-56">
          <h4 className="text-base font-medium">
            Name:
            <span className="text-amber-700 ml-2">{user?.displayName}</span>
          </h4>
          <h4 className="text-base font-medium">
            Email:
            <span className="text-amber-700 ml-2">{user?.email}</span>
          </h4>
        </div>
      </div>
      <p className="text-center mt-10">
        Want to update your profile?{' '}
        <Link
          className="text-blue-600 text-sm font-bold ml-2"
          to="/update-profile"
        >
          Click here
        </Link>
      </p>
    </div>
  );
};

export default AdminProfile;
