import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { Typewriter } from 'react-simple-typewriter';
import deleteImg from '../../assets/delete.svg';
import updateImg from '../../assets/update.svg';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import xButtonSVG from '../../assets/x-button.svg';
import { TbFidgetSpinner } from 'react-icons/tb';
import axios from 'axios';

// for export pdf
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// for image upload to imgbb
const image_hosting_key = import.meta.env.VITE_IMGBB_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const ManageApartments = () => {
  const { user } = useAuth();
  const doc = new jsPDF();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [apartmentToUpdate, setApartmentToUpdate] = useState({});
  const [updating, setUpdating] = useState(false);
  const axiosSecure = useAxiosSecure();
  const QueryClient = useQueryClient();

  // fetch apartments on start like useEffect
  const {
    data: apartments = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['apartments'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/apartments?email=${user?.email}`
      );
      return data;
    },
  });

  // delete an apartment instance
  const deleteApartment = useMutation({
    mutationFn: async id => {
      const { data } = await axiosSecure.delete(
        `/apartments/${id}?email=${user?.email}`
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Deleted!', 'Your apartment has been deleted.', 'success');
      refetch();
      // QueryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });

  const handleDeleteApartment = (id, apartmentStatus) => {
    if (apartmentStatus === 'rented') {
      return toast.error(
        "You cannot delete an apartment with the status 'Rented'.",
        { duration: 3000 }
      );
    }
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
        await deleteApartment.mutateAsync(id);
      }
    });
  };

  // get data and show modal to update an apartment
  const getDataForUpdate = async id => {
    const { data } = await axiosSecure.get(
      `/apartments/${id}?email=${user?.email}`
    );
    setApartmentToUpdate(data);
    setShowUpdateModal(true);
  };

  // update an apartment instance
  const updateApartment = useMutation({
    mutationFn: async updateData => {
      const { data } = await axiosSecure.patch(
        `/apartments/${apartmentToUpdate._id}?email=${user?.email}`,
        updateData
      );
      return data;
    },
    onSuccess: () => {
      setUpdating(false);
      setShowUpdateModal(false);
      Swal.fire('Updated!', 'Your apartment has been updated.', 'success');
      // refetch();
      setApartmentToUpdate({});
      QueryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });

  const handleUpdateApartment = async e => {
    e.preventDefault();
    setUpdating(true);
    const form = e.target;

    const image = form.image.files[0];
    const apartment = form.apartment.value;
    const floor = form.floor.value;
    const block = form.block.value;
    const room = form.room.value;
    const rent = form.rent.value;
    const status = form.status.value;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await axios.post(image_hosting_api, formData);
      const imageUrl = data.data.display_url;

      const updateData = {
        image: imageUrl,
        apartment,
        floor,
        block,
        room,
        rent,
        status,
      };

      await updateApartment.mutateAsync(updateData);
    } catch (error) {
      setUpdating(false);
      toast.error(error.message);
    }
  };

  const cancelUpdating = () => {
    setShowUpdateModal(false);
    setApartmentToUpdate({});
  };

  const handleExportPDF = () => {
    doc.autoTable({
      html: '#manageApartments',
      bodyStyles: { fillColor: 'yellow' },
    });
    doc.save('apartments.pdf');
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
        <title>UrbanUtopia | Manage Apartments</title>
      </Helmet>

      <div className="text-center">
        <span
          style={{ color: '#fa237d', fontWeight: 'bold', fontSize: '25px' }}
        >
          <Typewriter
            words={['Manage Apartments']}
            loop={550}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </div>
      <div className="text-end">
        <button
          className="btn bg-green-400 text-white"
          onClick={handleExportPDF}
        >
          Export PDF
        </button>
      </div>

      {apartments.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-black mt-8">
          <table className="table table-zebra" id="manageApartments">
            {/* head starts here */}
            <thead className="bg-green-400">
              <tr>
                <th className="text-sm text-black">Sl</th>
                <th className="text-sm text-black">Apartment</th>
                <th className="text-sm text-black">Floor</th>
                <th className="text-sm text-black">Block</th>
                <th className="text-sm text-black">Rooms</th>
                <th className="text-sm text-black">Rent</th>
                <th className="text-sm text-black">Status</th>
                <th className="text-sm text-black">Update</th>
                <th className="text-sm text-black">Delete</th>
              </tr>
            </thead>
            <tbody>
              {/* row starts here */}
              {apartments?.map((apart, i) => (
                <tr key={apart._id}>
                  <th>{i + 1}.</th>
                  <td>{apart.apartment}</td>
                  <td>{apart.floor}</td>
                  <td>{apart.block.toUpperCase()}</td>
                  <td>{apart.room}</td>
                  <td>${apart.rent}</td>
                  <td
                    className={`inline-flex items-center capitalize mt-2 px-3 py-1 rounded-full gap-x-2 ${
                      apart.status === 'available' &&
                      'bg-yellow-100/90 text-yellow-600'
                    } ${
                      apart.status === 'unavailable' &&
                      'bg-emerald-100/90 text-emerald-600'
                    }`}
                  >
                    {apart.status}
                  </td>
                  <td>
                    <div onClick={() => getDataForUpdate(apart._id)}>
                      <img
                        src={updateImg}
                        alt="update-apartment"
                        className="w-6"
                      />
                    </div>
                  </td>
                  <td>
                    <div
                      onClick={() =>
                        handleDeleteApartment(apart._id, apart.status)
                      }
                    >
                      <img
                        src={deleteImg}
                        alt="delete-apartment"
                        className="w-6"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="mt-20 text-xl font-bold text-center">
          No apartment yet
        </h3>
      )}
      {showUpdateModal && (
        <div className="fixed top-0 left-0 flex justify-center items-center h-screen w-full z-10">
          <div className="w-full md:w-3/5 h-3/4 rounded-xl bg-blue-200 text-center">
            <div className="card-actions justify-end">
              <button
                onClick={cancelUpdating}
                className="btn btn-square btn-sm"
              >
                <img src={xButtonSVG} alt="close" />
              </button>
            </div>
            <h3 className="mt-2 md:mt-6 text-base md:text-xl font-bold text-black">
              Update the apartment ({apartmentToUpdate.apartment})
            </h3>
            <div className="md:mt-8 mx-auto w-full md:w-2/3">
              <form onSubmit={handleUpdateApartment}>
                <div className="grid grid-cols-2 gap-8">
                  {/* Left side */}
                  <div className="flex-1">
                    <label className="block mt-4 mb-1 text-black text-sm">
                      Apartment Number
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="number"
                      required
                      defaultValue={apartmentToUpdate.apartment}
                      placeholder="Enter apartment number"
                      name="apartment"
                    />

                    <label className="block mt-4 mb-1 text-black text-sm">
                      Floor Number
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="number"
                      required
                      defaultValue={apartmentToUpdate.floor}
                      placeholder="Enter floor number"
                      name="floor"
                    />

                    <label className="block mt-4 mb-1 text-black text-sm">
                      Block
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="text"
                      required
                      defaultValue={apartmentToUpdate.block.toUpperCase()}
                      placeholder="Enter block"
                      name="block"
                    />

                    <label className="block mt-4 mb-1 text-black text-sm">
                      Status
                    </label>
                    <select
                      name="status"
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="text"
                      required
                      defaultValue={apartmentToUpdate.status}
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  {/* Right side */}
                  <div className="flex-1">
                    <label className="block mt-4 mb-1 text-black text-sm">
                      Number of Rooms
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="number"
                      required
                      defaultValue={apartmentToUpdate.room}
                      placeholder="Enter number of rooms"
                      name="room"
                    />

                    <label className="block mt-4 mb-1 text-black text-sm">
                      Image
                    </label>
                    <input
                      required
                      type="file"
                      name="image"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                    />

                    <label className="block mt-4 mb-1 text-black text-sm">
                      Rent in $
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="number"
                      required
                      defaultValue={apartmentToUpdate.rent}
                      placeholder="Enter rent"
                      name="rent"
                    />
                  </div>
                </div>

                <button
                  disabled={updating}
                  type="submit"
                  className="mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer w-32"
                >
                  {updating ? (
                    <TbFidgetSpinner className="animate-spin mx-auto" />
                  ) : (
                    'Update'
                  )}
                </button>

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

export default ManageApartments;
