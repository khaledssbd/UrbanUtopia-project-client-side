import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const [searchText, setSearchText] = useState('');
  // const [payments, setPayments] = useState([]);
  const [searchedPayments, setSearchedPayments] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // fetch data on start like useEffect
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['my-payments', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/payments/${user?.email}?email=${user?.email}`
      );
      return data;
    },
  });

  const handleReset = () => {
    setSearchText('');
    setShowSearchResult(false);
  };

  const handleSearch = async text => {
    if (text === '') {
      setSearchText('');
      setShowSearchResult(false);
      setSearchedPayments([]);
      return;
    }
    setIsSearching(true);
    setSearchText(text);
    setShowSearchResult(true);
    const { data } = await axiosSecure.get(
      `/search-payments?search=${text}&email=${user?.email}`
    );
    setSearchedPayments(data);
    setIsSearching(false);
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
        <title>UrbanUtopia | Payment History</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-12 mt-12">
        <div className="flex gap-12 justify-between items-center">
          <div className="flex p-1 overflow-hidden border rounded-lg focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
            <input
              className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
              type="text"
              onChange={e => handleSearch(e.target.value)}
              value={searchText}
              name="search"
              placeholder="Search by month name"
            />
          </div>
          <button onClick={handleReset} className="btn">
            Reset
          </button>
        </div>
      </div>
      <div>
        {showSearchResult && (
          <div>
            <h3 className="my-10 text-2xl font-bold text-center">
              Search Result
            </h3>
            <div>
              {isSearching ? (
                <div className="flex justify-center items-end mt-20">
                  <span className="loading loading-dots loading-lg"></span>
                </div>
              ) : (
                <div>
                  {searchedPayments.length === 0 ? (
                    <div className="h-20">
                      <h3 className="text-red-500 text-2xl font-bold text-center">
                        No result matched
                      </h3>
                    </div>
                  ) : (
                    <div className="border-2 border-gray-200 rounded-xl my-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {searchedPayments?.map(payment => (
                        <div
                          key={payment._id}
                          className="hover:scale-[1.05] transition-all flex flex-col gap-3 border border-gray-400 rounded-lg m-3 p-3 bg-gray-300 text-black min-h-0.5"
                        >
                          <h1 className="font-semibold text-lg text-center flex-grow">
                            Month: {payment.month}
                          </h1>

                          <div className="text-left">
                            <p className="mt-2 text-sm md:text-base text-black">
                              Date:{' '}
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                            <p className="mt-2 text-sm md:text-base text-black">
                              Floor: {payment.floor}
                            </p>
                            <p className="mt-2 text-sm md:text-base text-black">
                              Block: {payment.block}
                            </p>
                            <p className="mt-2 text-sm md:text-base text-black">
                              Apartment: {payment.apartment}
                            </p>
                            <p className="mt-2 text-sm md:text-base text-black">
                              Rooms: {payment.room}
                            </p>
                            <p className="mt-2 text-sm md:text-base text-black">
                              Paid: ${payment.rent}
                            </p>
                            <p className="mt-2 text-sm md:text-base text-black">
                              By: {payment.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <h3 className="text-3xl text-center mt-12">
        Total Payments: {payments.length}
      </h3>

      <div>
        {payments.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-black mt-8">
            <table className="table table-zebra">
              {/* head starts here */}
              <thead className="bg-green-400">
                <tr>
                  <th className="text-sm text-black">#</th>
                  <th className="text-sm text-black">NAME</th>
                  <th className="text-sm text-black">EMAIL</th>
                  <th className="text-sm text-black">PAYMENT ID</th>
                  <th className="text-sm text-black">MONTH</th>
                  <th className="text-sm text-black">STATUS</th>
                  <th className="text-sm text-black">PAID</th>
                  <th className="text-sm text-black">PAYMENT DATE</th>
                </tr>
              </thead>
              <tbody>
                {/* row starts here */}
                {payments?.map((item, i) => (
                  <tr key={item?._id}>
                    <td>{i + 1}.</td>
                    <td>{item?.name}</td>
                    <td>{item?.email}</td>
                    <td>{item?.paymentIntentId}</td>
                    <td>{item?.month}</td>
                    <td>{item?.status?.toUpperCase()}</td>
                    <td>${item?.rent}</td>
                    <td>{new Date(item?.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <h3 className="mt-20 md:mt-40 text-4xl font-bold text-center">
              No Payment Yet!
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
