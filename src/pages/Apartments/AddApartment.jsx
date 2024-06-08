import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';

// for image upload to imgbb
const image_hosting_key = import.meta.env.VITE_IMGBB_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddApartment = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleAddApartment = async e => {
    e.preventDefault();
    const form = e.target;

    const image = form.image.files[0];
    const apartment = form.apartment.value;
    const floor = form.floor.value;
    const block = form.block.value;
    const room = form.room.value;
    const rent = form.rent.value;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await axios.post(image_hosting_api, formData);
      const imageUrl = data.data.display_url;

      const apartmentDoc = {
        image: imageUrl,
        apartment,
        floor,
        block,
        room,
        rent,
        status: 'available'
      };

      const { data: apartmentConf } = await axiosSecure.post(
        `/apartments?email=${user?.email}`,
        apartmentDoc
      );

      if (apartmentConf.insertedId) {
        toast.success('Apartment added successfully');
        navigate('/dashboard/manage-apartments');
      }
    } catch (err) {
      toast.error(err.message);
      return;
    }
  };

  return (
    <div className="my-10">
      <Helmet>
        <title>UrbanUtopia | Add apartment</title>
      </Helmet>
      <div className="text-center">
        {/* <h3 className="text-2xl font-bold">Add your apartment</h3> */}
        <span
          style={{ color: '#fa237d', fontWeight: 'bold', fontSize: '25px' }}
        >
          <Typewriter
            words={['Add apartment']}
            loop={550}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
        <div className="mt-8 mx-auto w-full md:w-2/3">
          <form onSubmit={handleAddApartment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side */}
              <div className="flex-1">
                <label className="block mt-4 mb-1">Apartment Number</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="number"
                  required
                  name="apartment"
                  placeholder="Enter apartment number"
                />

                <label className="block mt-4 mb-1">Floor Number</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="number"
                  required
                  name="floor"
                  placeholder="Enter floor number"
                />

                <label className="block mt-4 mb-1">Block</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="text"
                  required
                  name="block"
                  placeholder="Enter apartment block"
                />
              </div>
              {/* Right side */}
              <div className="flex-1">
                <label className="block mt-4 mb-1">Number of Rooms</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="number"
                  required
                  name="room"
                  placeholder="Enter number of rooms"
                />

                <label className="block mt-4 mb-1">Image</label>
                <input
                  required
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                />

                <label className="block mt-4 mb-1">Rent in $</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="number"
                  required
                  name="rent"
                  placeholder="Enter rent"
                />
              </div>
            </div>
            <input
              className="mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
              type="submit"
              value="Add Apartment"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddApartment;
