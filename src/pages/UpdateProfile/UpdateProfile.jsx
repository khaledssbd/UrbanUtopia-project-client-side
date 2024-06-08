import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useState } from 'react';

const image_hosting_key = import.meta.env.VITE_IMGBB_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateProfile = () => {
  const { updateUserProfile, user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdating(true);
    const form = e.target;

    const name = form.name.value;
    // const email = form.email.value;
    const image = form.image.files[0];

    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await axios.post(image_hosting_api, formData);
      const imageUrl = data.data.display_url;
      await updateUserProfile(name, imageUrl);

      setUpdating(false);
      toast.success('Updated successfully');
      navigate('/dashboard');
    } catch (error) {
      setUpdating(false);
      toast.error(error);
    }
  };

  return (
    <div className="py-20 px-5">
      <Helmet>
        <title>UrbanUtopia | Update Profile</title>
      </Helmet>
      <h2 className="text-xl sm:text-2xl mt-10 mb-5 text-center font-bold">
        Update your Profile
      </h2>
      <form onSubmit={handleUpdate} className=" md:w-3/4 lg:w-1/2 mx-auto">
        <div className="form-control">
          <label className="label label-text text-base font-semibold">
            Name
          </label>
          <input
            type="text"
            required
            name="name"
            placeholder="Your Name"
            defaultValue={user?.displayName}
            className="input input-bordered"
          />
        </div>
        <div className="form-control w-full">
          <label className="label label-text text-base font-semibold mt-5">
            Select Image:
          </label>
          <input
            required
            type="file"
            name="image"
            accept="image/*"
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control">
          <label className="label label-text text-red-500 text-base font-semibold mt-5">
            Email {'(fixed)'}
          </label>
          <input
            type="email"
            required
            name="email"
            placeholder="Your Email"
            defaultValue={user?.email}
            className="input input-bordered"
            readOnly
          />
        </div>
        <div className="form-control mt-6">
          <button
            disabled={updating}
            type="submit"
            className="bg-primary w-full rounded-md py-3 text-white"
          >
            {updating ? (
              <TbFidgetSpinner className="animate-spin m-auto" />
            ) : (
              'Update'
            )}
          </button>
        </div>
      </form>

      <p className="text-center mt-4">
        Want to check your profile?{' '}
        <Link
          className="text-blue-600 text-sm font-bold ml-2"
          to="/user-profile"
        >
          Click here
        </Link>
      </p>
    </div>
  );
};

export default UpdateProfile;
