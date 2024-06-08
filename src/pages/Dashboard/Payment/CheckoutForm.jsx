import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// import { useQuery } from '@tanstack/react-query';
import { FaArrowsSpin } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const CheckoutForm = () => {
  const { user, loading } = useAuth();
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [rent, setRent] = useState(0);
  const [rentToPay, setRentToPay] = useState(0);
  const [transectionId, setTransectionId] = useState('');
  const [working, setWorking] = useState(false);
  // const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  // fetch coupons on start like useEffect
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/coupons?email=${user?.email}`);
      return data;
    },
  });

  useEffect(() => {
    const storedPayment = localStorage.getItem('payment');
    if (storedPayment) {
      const savedData = JSON.parse(storedPayment) || {};
      setPaymentData(savedData);
      const rent = savedData.rent;
      setRent(rent);
      setRentToPay(rent);
    }
  }, []);

  useEffect(() => {
    if (rentToPay > 0) {
      axiosSecure
        .post(`/create-payment-intent?email=${user?.email}`, {
          rent: rentToPay,
        })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecure, rentToPay, user?.email]);
  
  const handlePayment = async e => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: card,
    // });

    // if (error) {
    //   setError(error.message);
    // } else {
    //   console.log('[Payment Method]', paymentMethod);
    //   setError('');
    // }

    setWorking(true);
    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
    });

    if (error) {
      setError(error.message);
      setWorking(false);
    } else {
      setError('');
    }

    // confirm payment
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || 'annonymous',
            name: user?.displayName || 'annonymous',
          },
        },
      });

    if (confirmError) {
      setError(confirmError.message);
      setWorking(false);
    } else {
      setError('');
      if (paymentIntent.status === 'succeeded') {
        setTransectionId(paymentIntent.id);

        // now save the payment in database
        const payment = {
          email: user?.email,
          name: user?.displayName,
          date: new Date(),
          paymentIntentId: paymentIntent?.id,
          month: paymentData?.month,
          apartment: paymentData?.apartment,
          floor: paymentData?.floor,
          block: paymentData?.block,
          room: paymentData?.room,
          rent: parseFloat(rentToPay),
          status: 'paid',
        };

        const { data } = await axiosSecure.post(
          `/payments?email=${user.email}`,
          payment
        );
        if (data?.insertedId) {
          setWorking(false);
          localStorage.removeItem('payment');
          navigate('/dashboard/payment-history');
          // refetch();
          Swal.fire({
            icon: 'success',
            title: 'Payment Successfull!',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    }
  };

  const handleCoupon = async e => {
    e.preventDefault();

    // if (couponApplied) {
    //   return toast.error('Coupon already applied');
    // }
    const couponText = e.target.coupon.value;
    const coupon = coupons.find(cop => cop.coupon === couponText);

    if (coupon && coupon.status === 'valid') {
      const discount = coupon.discount;
      const rentAfterCoupon = rent - (rent * discount) / 100;

      setRentToPay(rentAfterCoupon);
      // setCouponApplied(true);
      toast.success('Coupon Applied!');
    } else {
      toast.error('Invalid or wrong coupon!');
    }
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
      <h3 className="text-2xl text-center font-bold mt-20 mb-12 text-blue-500">
        Pay: ${rentToPay}
      </h3>
      <div className="w-full md:w-1/2 mx-auto bg-gray-200 p-10 border-2 border-gray-300 rounded-md text-center">
        <form
          className="flex justify-around items-center gap-3"
          onSubmit={handleCoupon}
        >
          <div>
            <label className="block mb-1 text-left text-black">Enter Coupon</label>
            <input
              className="w-full p-2 border-2 rounded-lg border-green-500 focus:outline-red-500"
              type="text"
              required
              name="coupon"
              placeholder="Enter coupon"
            />
          </div>
          <button
            type="submit"
            // disabled={couponApplied}
            className="bg-green-500 text-sm font-medium p-2 rounded-lg mt-5"
          >
            Apply
          </button>
          {/* <input
            type="submit"
            value="Apply"
            className=" bg-green-500 text-sm font-medium p-2 rounded-lg mt-5"
          /> */}
        </form>

        <form className="mt-20" onSubmit={handlePayment}>
          <div>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
            <button
              className="btn btn-sm btn-primary my-4 px-5 md:px-8"
              type="submit"
              disabled={!stripe || !clientSecret || working}
            >
              {working ? (
                <FaArrowsSpin className="animate-spin text-red-500 bg-green" />
              ) : (
                'Pay'
              )}
            </button>
            {error && <p className="text-red-600">{error}</p>}
            {transectionId && (
              <p className="text-green-600">
                Your transaction id: {transectionId}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
