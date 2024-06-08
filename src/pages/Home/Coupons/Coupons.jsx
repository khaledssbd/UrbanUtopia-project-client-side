import { useQuery } from '@tanstack/react-query';
import cuponDevider from '../../../assets/cupon-devider.png';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { Link } from 'react-router-dom';

const Coupons = () => {
  const axiosPublic = useAxiosPublic();

  // fetch coupons on start like useEffect
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/coupons`);
      const validCoupons = data.filter(coupon => coupon.status === 'valid');
      return validCoupons;
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
    <div className="my-20 bg-white rounded-lg py-5">
      <h3 className="text-black text-2xl md:text-4xl font-bold">Our Coupons</h3>

      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 px-8  sm:px-24">
          {coupons.map(coupon => (
            <Link
              to="/all-apartments"
              key={coupon._id}
              className="bg-amber-600 w-full  rounded-3xl flex flex-row items-center justify-center hover:scale-[1.05] transition-all ease-in-out"
            >
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-black text-2xl md:text-3xl font-black">
                  {coupon.discount}% OFF
                </h3>
                <h3 className="text-black font-semibold text-sm">
                  {coupon.description}
                </h3>
              </div>
              <div>
                <img src={cuponDevider} alt="" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-black text-2xl md:text-3xl font-bold">
                  {coupon.coupon}
                </h3>
                <h3 className="text-xl text-black">Coupon Code</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h3 className="mt-20 text-xl font-bold text-center">
          No coupon available
        </h3>
      )}
    </div>
  );
};

export default Coupons;
