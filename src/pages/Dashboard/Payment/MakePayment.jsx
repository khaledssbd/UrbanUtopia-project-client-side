import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const MakePayment = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('payment');
  }, []);

  const { data: apartment = {}, isLoading } = useQuery({
    queryKey: ['apartment-rent', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/agreement/${user?.email}?email=${user?.email}`
      );
      return data;
    },
  });

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePayRent = e => {
    e.preventDefault();
    const form = e.target;
    const lesseeName = user?.displayName;
    const lesseeEmail = form.email.value;
    const apartment = form.apartment.value;
    const floor = form.floor.value;
    const block = form.block.value;
    const room = form.room.value;
    const rent = form.rent.value;
    const month = form.month.value;

    if (!rent) {
      return toast.error('Nothing to pay');
    }

    const doc = {
      lesseeName,
      lesseeEmail,
      apartment,
      floor,
      block,
      room,
      rent,
      month,
      status: 'not paid',
    };
    localStorage.setItem('payment', JSON.stringify(doc));
    navigate('/dashboard/payment-page');
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>UrbanUtopia | Payment Confirmation</title>
      </Helmet>

      <h3 className="mt-2 md:mt-8 text-lg md:text-2xl font-bold text-center">
        Rented apartment
      </h3>
      <div className="md:mt-8 mx-auto w-full md:w-2/3">
        <form onSubmit={handlePayRent}>
          <div className="grid grid-cols-2 gap-8">
            {/* Left side */}
            <div className="flex-1">
              <label className="block mt-4 mb-1 text-black text-sm md:text-base">
                Your email
              </label>
              <input
                className="md:w-full p-2 border rounded-lg border-red-500 text-sm"
                type="email"
                required
                readOnly
                defaultValue={user?.email}
                name="email"
              />

              <label className="block mt-6 mb-1 text-black text-sm md:text-base">
                Apartment Number
              </label>
              <input
                className="md:w-full p-2 border rounded-lg border-red-500 text-sm"
                type="number"
                required
                readOnly
                defaultValue={apartment?.apartment}
                name="apartment"
              />

              <label className="block mt-6 mb-1 text-black text-sm md:text-base">
                Floor Number
              </label>
              <input
                className="md:w-full p-2 border rounded-lg border-red-500 text-sm"
                type="number"
                required
                readOnly
                defaultValue={apartment?.floor}
                name="floor"
              />

              <label className="block mt-6 mb-1 text-black text-sm md:text-base">
                Block Name
              </label>
              <input
                className="md:w-full p-2 border rounded-lg border-red-500 text-sm"
                type="text"
                required
                readOnly
                defaultValue={apartment?.block?.toUpperCase()}
                name="block"
              />
            </div>
            {/* Right side */}
            <div className="flex-1">
              <label className="block mt-4 mb-1 text-black text-sm md:text-base">
                Number of Rooms
              </label>
              <input
                className="md:w-full p-2 border rounded-lg border-red-500 text-sm"
                type="number"
                required
                readOnly
                defaultValue={apartment?.room}
                name="room"
              />

              <label className="block mt-6 mb-1 text-black text-sm md:text-base">
                Rent in $
              </label>
              <input
                className="md:w-full p-2 border rounded-lg border-red-500 text-sm"
                type="text"
                required
                readOnly
                defaultValue={apartment?.rent}
                name="rent"
              />

              <label className="block mt-6 mb-1 text-black text-sm md:text-base">
                Month
              </label>
              <select
                name="month"
                className="md:w-full p-2 border rounded-lg border-green-500 text-sm"
                type="text"
                required
                placeholder="Month"
              >
                <option hidden value="">
                  Select a month
                </option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <button
            type="submit"
            className="mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer w-32"
          >
            Submit
          </button> */}

          <div className="text-center">
            <input
              type="submit"
              className="mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer w-32"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakePayment;
