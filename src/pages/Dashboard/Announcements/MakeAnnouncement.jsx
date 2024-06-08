import { Helmet } from 'react-helmet-async';
import { Typewriter } from 'react-simple-typewriter';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MakeAnnouncement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const handleAddAnnouncements = async e => {
    e.preventDefault();
    const form = e.target;

    const title = form.title.value;
    const description = form.description.value;
    const announcement = {
      title,
      description,
    };
    try {
      const { data } = await axiosSecure.post(
        `/announcements?email=${user?.email}`,
        announcement
      );

      if (data.insertedId) {
        form.reset();
        toast.success('Announcement added successfully');
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="my-10">
      <Helmet>
        <title>UrbanUtopia | Add Announcement</title>
      </Helmet>
      <div className="text-center">
        <span
          style={{
            color: '#fa237d',
            fontWeight: 'bold',
            fontSize: '25px',
          }}
        >
          <Typewriter
            words={['Add Announments']}
            loop={50}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
        <div className="mt-8 mx-auto w-full md:w-1/2">
          <form onSubmit={handleAddAnnouncements}>
            <label className="block mt-4 mb-2 text-xl">
              Announcement Title
            </label>
            <input
              className="w-full p-2 border rounded-lg focus:outline-green-500"
              type="text"
              required
              name="title"
              placeholder="Announcement"
            />

            <label className="block mt-10 mb-2 text-xl">
              Announcement Description
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-green-500"
              name="description"
              required
              placeholder="Announcement description"
              cols="1"
              rows="5"
            />

            <input
              className="mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
              type="submit"
              value="Add Announcement"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncement;
