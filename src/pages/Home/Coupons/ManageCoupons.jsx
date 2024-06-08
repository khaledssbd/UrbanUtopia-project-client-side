import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { Typewriter } from 'react-simple-typewriter';
import deleteImg from '../../../assets/delete.svg';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import xButtonSVG from '../../../assets/x-button.svg';
import { TbFidgetSpinner } from 'react-icons/tb';

// for export pdf
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ManageCoupons = () => {
  const { user, loading } = useAuth();
  const doc = new jsPDF();

  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const axiosSecure = useAxiosSecure();
  const QueryClient = useQueryClient();

  // fetch coupons on start like useEffect
  const {
    data: coupons = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/coupons?email=${user?.email}`);
      return data;
    },
  });

  // update a coupon instance
  const updateCoupon = useMutation({
    mutationFn: async ({ newStatus, id }) => {
      const { data } = await axiosSecure.patch(
        `/coupons/${id}?email=${user?.email}`,
        { newStatus }
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Updated!', 'Your coupon status has been updated.', 'success');
      // refetch();
      QueryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const handleCouponStatusChange = async (newStatus, id) => {
    await updateCoupon.mutateAsync({ newStatus, id });

    // const { data } = await axiosSecure.patch(
    //   `/coupons/${id}?email=${user?.email}`,
    //   { newStatus }
    // );
    // if (data.modifiedCount > 0) {
    //   Swal.fire('Updated!', 'Your coupon Status has been updated.', 'success');
    //   refetch();
    // }
  };

  // delete a coupon instance
  const deleteCoupon = useMutation({
    mutationFn: async id => {
      const { data } = await axiosSecure.delete(
        `/coupons/${id}?email=${user?.email}`
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Deleted!', 'Your coupon has been deleted.', 'success');
      refetch();
      // QueryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const handleDeleteCoupon = id => {
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
        await deleteCoupon.mutateAsync(id);
      }
    });
  };

  // add a coupon instance
  const addCoupon = useMutation({
    mutationFn: async newCoupon => {
      const { data } = await axiosSecure.post(
        `/coupons?email=${user?.email}`,
        newCoupon
      );
      return data;
    },
    onSuccess: () => {
      setAdding(false);
      setShowAddModal(false);
      Swal.fire('Added!', 'Your coupon has been added.', 'success');
      refetch();
      QueryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const handleAddCoupon = async e => {
    e.preventDefault();
    setAdding(true);
    const form = e.target;

    const coupon = form.coupon.value;
    const discount = form.discount.value;
    const description = form.description.value;

    try {
      const newCoupon = {
        coupon,
        discount,
        description,
        status: 'valid',
      };

      await addCoupon.mutateAsync(newCoupon);
    } catch (error) {
      setAdding(false);
      toast.error(error.message);
    }
  };

  const cancelAdding = () => {
    setShowAddModal(false);
  };

  const handleExportPDF = () => {
    doc.autoTable({
      html: '#manageCoupons',
      bodyStyles: { fillColor: 'yellow' },
    });
    doc.save('coupons.pdf');
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-10 sm:px-6">
      <Helmet>
        <title>UrbanUtopia | Manage Coupons</title>
      </Helmet>

      <div className="text-center">
        <span
          style={{ color: '#fa237d', fontWeight: 'bold', fontSize: '25px' }}
        >
          <Typewriter
            words={['Manage Coupons']}
            loop={550}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </div>
      <div className="flex justify-around items-center mt-16">
        <button
          className="btn bg-green-600 text-white"
          onClick={handleExportPDF}
        >
          Export PDF
        </button>

        <button
          className="btn bg-blue-600 text-white"
          onClick={() => setShowAddModal(true)}
        >
          Add Coupon
        </button>
      </div>

      {coupons.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-black mt-8">
          <table className="table table-zebra" id="manageCoupons">
            {/* head starts here */}
            <thead className="bg-green-400">
              <tr>
                <th className="text-sm text-black">Sl</th>
                <th className="text-sm text-black">Coupon Code</th>
                <th className="text-sm text-black">Discount</th>
                <th className="text-sm text-black">Description</th>
                <th className="text-sm text-black">Status</th>
                <th className="text-sm text-black">Delete</th>
              </tr>
            </thead>
            <tbody>
              {/* row starts here */}
              {coupons?.map((cou, i) => (
                <tr key={cou._id}>
                  <th>{i + 1}.</th>
                  <td>{cou.coupon}</td>
                  <td>{cou.discount}%</td>
                  <td>{cou.description}</td>
                  <td>
                    <select
                      name="status"
                      className="p-2 border rounded-lg focus:outline-green-500"
                      type="text"
                      required
                      onChange={e =>
                        handleCouponStatusChange(e.target.value, cou._id)
                      }
                      defaultValue={cou.status}
                    >
                      <option value="valid">Valid</option>
                      <option value="invalid">Invalid</option>
                    </select>
                  </td>
                  <td>
                    <div onClick={() => handleDeleteCoupon(cou._id)}>
                      <img
                        src={deleteImg}
                        alt="delete-coupon"
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
        <h3 className="mt-20 text-xl font-bold text-center">No coupon yet</h3>
      )}
      {showAddModal && (
        <div className="fixed top-0 left-0 flex justify-center items-center h-screen w-full z-10">
          <div className="w-full md:w-1/2 h-2/3 rounded-xl bg-blue-300 text-center">
            <div className="card-actions justify-end">
              <button onClick={cancelAdding} className="btn btn-square btn-sm">
                <img src={xButtonSVG} alt="close" />
              </button>
            </div>
            <h3 className="mt-2 md:mt-8 text-base md:text-xl font-bold text-black">
              Add a coupon
            </h3>
            <div className="md:mt-8 mx-auto w-full md:w-2/3">
              <form onSubmit={handleAddCoupon}>
                <div className="">
                  <div className="">
                    <label className="block mt-4 mb-1 text-black text-sm">
                      Coupon Code
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="text"
                      required
                      placeholder="Enter coupon code"
                      name="coupon"
                    />

                    <label className="block mt-4 mb-1 text-black text-sm">
                      Discount %
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="number"
                      required
                      placeholder="Enter discount parcentage"
                      name="discount"
                    />

                    <label className="block mt-4 mb-1 text-black text-sm">
                      Description
                    </label>
                    <input
                      className="md:w-full p-2 border rounded-lg focus:outline-green-500 text-sm"
                      type="text"
                      required
                      placeholder="Enter description"
                      name="description"
                    />
                  </div>
                </div>

                <button
                  disabled={adding}
                  type="submit"
                  className="mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer w-32"
                >
                  {adding ? (
                    <TbFidgetSpinner className="animate-spin mx-auto" />
                  ) : (
                    'Add'
                  )}
                </button>

                <button
                  className="ml-10 mt-2 md:mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-red-500 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                  onClick={cancelAdding}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
