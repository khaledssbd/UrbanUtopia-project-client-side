import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userImg from '../../../assets/user.png';
import useAuth from '../../../hooks/useAuth';
import { Tooltip } from 'react-tooltip';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UserProfile = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ['user-profile', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/user/profile/${user?.email}?email=${user?.email}`
      );
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-end pt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="py-5">
      <Helmet>
        <title>UrbanUtopia | User Profile</title>
      </Helmet>
      <h2 className="text-xl sm:text-2xl mt-10 mb-5 text-center font-bold">
        Your Profile
      </h2>
      <div className="md:w-3/4 lg:w-1/2 mx-auto">
        <div className="flex justify-center items-center my-10">
          <img
            className="rounded-full w-48 h-48"
            src={user?.photoURL || userImg}
            referrerPolicy="no-referrer"
            data-tooltip-id="userName"
            data-tooltip-content={
              user?.displayName ? user?.displayName : 'No Name Set Yet'
            }
            data-tooltip-place="right"
          />
          <Tooltip id="userName" />
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
          <h4 className="text-base font-medium">
            Floor:
            <span className="text-amber-700 ml-2">{profile?.floor}</span>
          </h4>
          <h4 className="text-base font-medium">
            Block:
            <span className="text-amber-700 ml-2">{profile?.block}</span>
          </h4>
          <h4 className="text-base font-medium">
            Room:
            <span className="text-amber-700 ml-2">{profile?.room}</span>
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

export default UserProfile;
