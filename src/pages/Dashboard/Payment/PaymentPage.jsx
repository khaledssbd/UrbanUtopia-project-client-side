import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Helmet } from 'react-helmet-async';

const stripePromise = loadStripe(import.meta.env.VITE_Publishable_Key);

const PaymentPage = () => {
  return (
    <div>
      <Helmet>
        <title>UrbanUtopia | Make Payment</title>
      </Helmet>
      <div>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
