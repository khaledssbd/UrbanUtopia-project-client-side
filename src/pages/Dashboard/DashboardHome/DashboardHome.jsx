import useAuth from '../../../hooks/useAuth';

const DashboardHome = () => {
  const { user } = useAuth();
  return (
    <div className="m-20">
      <h2 className="text-3xl text-center mb-10">
        <span>Hi, </span> {user.displayName ? user.displayName : 'Back'}
      </h2>
      <h2 className="text-lg my-3">Welcome to UrbanUtopia!</h2>
      <h5 className="text-lg">
        We are delighted to have you. At UrbanUtopia, we strive to create a
        seamless and enjoyable experience for property renters. Our platform
        allows renters with a smooth and convenient way to find their ideal
        home. Explore our extensive listings, utilize exclusive coupons for your
        next rental, and experience a new standard of living with UrbanUtopia.
        Whether you are looking for a cozy apartment or managing multiple
        properties, UrbanUtopia is here to make your journey efficient and
        enjoyable. Thank you for choosing UrbanUtopia, where your perfect urban
        living experience begins.
      </h5>
      <h5 className="text-lg mt-3">Warm regards,</h5>
      <h5 className="text-lg">The UrbanUtopia Team</h5>
    </div>
  );
};
export default DashboardHome;
