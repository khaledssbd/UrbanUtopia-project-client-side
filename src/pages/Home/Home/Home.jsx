import { Helmet } from 'react-helmet-async';
import Banner from '../Banner/Banner';
import Hero from '../Hero/Hero';
import AboutTheBuilding from '../AboutTheBuilding/AboutTheBuilding';
import Coupons from '../Coupons/Coupons';
import Location from '../Location/Location';

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>UrbanUtopia | Home</title>
      </Helmet>
      <Banner />
      <Hero />
      <AboutTheBuilding />
      <Coupons />
      <Location />
    </div>
  );
};

export default Home;
