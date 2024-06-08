import { Helmet } from 'react-helmet-async';
import { Typewriter } from 'react-simple-typewriter';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import deleteImg from '../../../assets/delete.svg';
import updateImg from '../../../assets/update.svg';
import eyeImg from '../../../assets/eye.svg';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import xButtonSVG from '../../../assets/x-button.svg';
import toast from 'react-hot-toast';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const ManageAnnouncements = () => {
  const { user } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [announcementToUpdate, setAnnouncementToUpdate] = useState({});
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const QueryClient = useQueryClient();

  // fetch data on start like useEffect
  const {
    data: announcements = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/announcements?email=${user?.email}`
      );
      return data;
    },
  });

  // delete a announcement instance
  const deleteAnnouncement = useMutation({
    mutationFn: async ({ id }) => {
      const { data } = await axiosSecure.delete(
        `/announcements/${id}?email=${user?.email}`
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Deleted!', 'This announcement has been deleted.', 'success');
      refetch();
      // QueryClient.invalidateQueries({ queryKey: ['announcement'] });
    },
  });

  const handleDeleteAnnouncement = id => {
    Swal.fire({
      title: 'Confirm to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        await deleteAnnouncement.mutateAsync({ id });
      }
    });
  };

  // get data and show modal to update a announcement
  const getDataForUpdate = async id => {
    const { data } = await axiosPublic.get(`/announcements/${id}`);
    setAnnouncementToUpdate(data);
    setShowUpdateModal(true);
  };

  // update a announcement instance
  const updateAnnouncement = useMutation({
    mutationFn: async ({ updateData }) => {
      const { data } = await axiosSecure.patch(
        `/announcements/${announcementToUpdate._id}?email=${user?.email}`,
        updateData
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Updated!', 'Your announcement has been updated.', 'success');
      setShowUpdateModal(false);
      setAnnouncementToUpdate({});
      // refetch();
      QueryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const handleUpdateAnnouncement = async e => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;

    try {
      const updateData = {
        title,
        description,
      };

      await updateAnnouncement.mutateAsync({ updateData });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelUpdating = () => {
    setShowUpdateModal(false);
    setAnnouncementToUpdate({});
  };

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
            loop={50}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </h3>

      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {announcements?.map((announcement, i) => (
            <div
              key={i}
              className="p-3 bg-gray-300 rounded-xl flex flex-col"
              data-aos="zoom-out-up"
            >
              <h3 className="mx-5 font-medium text-base md:text-lg lg:text-xl my-3 text-black">
                {announcement.title.slice(0, 30)}...
              </h3>
              <h3 className="mx-5 mb-3  text-base text-black font-normal">
                Description: {announcement.description.slice(0, 200)}...
              </h3>

              <div className="flex justify-around items-center border rounded-md border-gray-500 p-2">
                <Link to={`/dashboard/announcement/${announcement._id}`}>
                  <img src={eyeImg} alt="view-booking" className="w-6" />
                </Link>

                <div onClick={() => getDataForUpdate(announcement._id)}>
                  <img src={updateImg} alt="update-booking" className="w-6" />
                </div>

                <div onClick={() => handleDeleteAnnouncement(announcement._id)}>
                  <img src={deleteImg} alt="delete-booking" className="w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h3 className="mt-20 text-xl font-bold text-center">
          No announcement yet
        </h3>
      )}
      {showUpdateModal && (
        <div className=" fixed top-0 left-0 flex justify-center items-center h-screen w-full z-10">
          <div className="w-full md:w-1/2 h-2/3 rounded-xl bg-blue-300 text-center">
            <div className="card-actions justify-end">
              <button
                onClick={cancelUpdating}
                className="btn btn-square btn-sm"
              >
                <img src={xButtonSVG} alt="close" />
              </button>
            </div>
            <h3 className="mt-3 mb-2 md:mt-8 text-base md:text-xl font-bold text-black">
              Update ({announcementToUpdate.title.slice(0, 20) +'...'})
            </h3>
            <div className="mt-8 mx-auto w-full md:w-1/2">
              <form onSubmit={handleUpdateAnnouncement}>
                <label className="block mt-4 mb-1 text-sm text-black">
                  Announcement Title
                </label>
                <input
                  className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                  type="text"
                  required
                  placeholder="Enter title"
                  defaultValue={announcementToUpdate.title}
                  name="title"
                />

                <label className="block mt-3 mb-1 text-sm text-black">
                  Announcement Description
                </label>
                <textarea
                  className="w-3/4 md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                  name="description"
                  required
                  placeholder="Enter description"
                  defaultValue={announcementToUpdate.description}
                  cols="1"
                  rows="2"
                />

                <input
                  className="mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer"
                  type="submit"
                  value="Update"
                />
                <button
                  className="ml-10 mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-red-500 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                  onClick={cancelUpdating}
                >
                  Not Now
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
