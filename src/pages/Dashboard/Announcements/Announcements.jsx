import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Typewriter } from 'react-simple-typewriter';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const Announcements = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/announcements?email=${user?.email}`
      );

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-10 sm:px-6">
      <Helmet>
        <title>UrbanUtopia | Manage Services</title>
      </Helmet>

      <h3 className="flex justify-center items-center my-10 text-center text-[#fa237d] text-2xl font-bold">
        {announcements.length}
        <span
          style={{ color: '#fa237d', fontWeight: 'bold', fontSize: '25px' }}
        >
          <Typewriter
            words={['- Announcements']}
            loop={550}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </h3>

      {announcements.length > 0 ? (
        <div className="flex flex-col gap-6">
          {announcements?.map((announcement, i) => (
            <div
              key={i}
              className="p-3 bg-gray-300 rounded-xl flex flex-col"
              data-aos="zoom-out-up"
            >
              <h3 className="font-medium text-base my-3 text-black text-right px-3">
                {new Date(announcement.date).toLocaleDateString()}
              </h3>
              <h3 className="font-medium text-base md:text-lg lg:text-xl my-3 text-black text-center pb-8">
                {announcement.title.slice(0, 50)}...
              </h3>
              <h3 className="flex gap-3 mx-5 mb-3  text-base text-black font-normal">
                Description: {announcement.description.slice(0, 250)}...
              </h3>

              <Link
                className="text-center mt-5"
                to={`/dashboard/announcement/${announcement._id}`}
              >
                <button className="btn btn-primary text-lg">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <h3 className="mt-20 text-xl font-bold text-center">
          No announcement yet
        </h3>
      )}
    </div>
  );
};

export default Announcements;
