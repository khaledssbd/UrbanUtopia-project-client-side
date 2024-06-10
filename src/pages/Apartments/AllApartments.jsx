import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useState } from 'react';

const AllApartments = () => {
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  // const [count, setCount] = useState(0);

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('access-token');

  // fetch apartments by page on start like useEffect
  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['apartments', currentPage, itemsPerPage],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/apartments?page=${currentPage}&size=${itemsPerPage}`
      );
      return data;
    },
  });

  // get apartments count
  const { data: count = 0, isLoading: isCountLoading } = useQuery({
    queryKey: ['apartments-count'],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `${import.meta.env.VITE_API_URL}/apartments-count`
      );
      return data.count;
    },
  });

  // fetch if any agreement with the user is already in pending on start like useEffect
  const {
    data: status = '',
    isLoading: isStatusLoading,
    refetch,
  } = useQuery({
    queryKey: ['status', user?.email],
    enabled: !loading && !!user?.email && !!token,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/agreements/${user?.email}?email=${user?.email}`
      );
      return data;
    },
  });

  const handleAgreement = async apartment => {
    if (!user) {
      navigate('/login');
      return toast.error('You must login first!');
    }

    if (status === 'pending') {
      return toast.error('You already have a pending agreement!');
    }

    if (status === 'checked') {
      return toast.error('You are already in an agreement!');
    }

    if (apartment.status === 'unavailable') {
      return toast.error('The Apartment is unavailable!');
    }

    const lesseeDoc = {
      lesseeName: user?.displayName,
      lesseeEmail: user?.email,
      floor: apartment.floor,
      block: apartment.block,
      room: apartment.room,
      apartment: apartment.apartment,
      rent: apartment.rent,
      status: 'pending',
      requestDate: new Date(),
    };

    const { data } = await axiosSecure.post(
      `/agreements?email=${user?.email}`,
      lesseeDoc
    );
    if (data.insertedId) {
      refetch();
      toast.success('Agreement added successfully. Wait for the confirmation!');
    }
  };

  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()]?.map(element => element + 1);

  //  handle pagination button
  const handlePaginationButton = value => {
    setCurrentPage(value);
  };

  if (isLoading || isStatusLoading || isCountLoading) {
    return (
      <div className="flex justify-center items-end pt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-24">
      <h3 className="mt-10 font-bold text-2xl">All Apartments</h3>
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {apartments?.map(apartment => (
          <div
            key={apartment._id}
            className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all text-start border border-gray-300"
          >
            <div className="flex justify-center items-center">
              <img
                className="rounded-lg"
                src={apartment.image}
                alt={apartment.apartment}
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 text-center my-4">
                Apartment: {apartment.apartment}
              </h1>

              <div className="flex items-center justify-around border-t border-gray-300">
                <div className="text-left">
                  <p className="mt-2 text-sm text-gray-600 ">
                    Floor: {apartment.floor}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 ">
                    Block: {apartment.block}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 ">
                    Rooms: {apartment.room}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 ">
                    Rent: ${apartment.rent}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 ">
                    Status:{' '}
                    <span className="capitalize">{apartment.status}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleAgreement(apartment)}
                  className="text-white hover:bg-blue-700 bg-green-500 rounded-lg p-2"
                >
                  Agree to book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Section */}
      <div className="flex justify-center mt-12">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => handlePaginationButton(currentPage - 1)}
          className="px-4 py-2 mx-1 text-gray-700 disabled:text-gray-500 capitalize bg-gray-200 rounded-md disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:bg-blue-500  hover:text-white"
        >
          <div className="flex items-center -mx-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>

            <span className="mx-1">previous</span>
          </div>
        </button>
        {/* Numbers */}
        {pages?.map(btnNum => (
          <button
            onClick={() => handlePaginationButton(btnNum)}
            key={btnNum}
            className={`hidden ${
              currentPage === btnNum ? 'bg-blue-600 text-white' : 'bg-blue-200'
            } px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-blue-500 text-black hover:text-white`}
          >
            {btnNum}
          </button>
        ))}
        {/* Next Button */}
        <button
          disabled={currentPage === numberOfPages}
          onClick={() => handlePaginationButton(currentPage + 1)}
          className="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-gray-200 rounded-md hover:bg-blue-500 disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
        >
          <div className="flex items-center -mx-1">
            <span className="mx-1">Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AllApartments;
