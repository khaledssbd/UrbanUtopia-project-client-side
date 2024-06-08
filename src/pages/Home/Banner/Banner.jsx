import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import banner0 from '../../../assets/building/building-1.jpg';
import banner1 from '../../../assets/rooms/room-1.jpg';
import banner2 from '../../../assets/rooms/room-2.jpg';
import banner3 from '../../../assets/rooms/room-3.jpg';
import banner4 from '../../../assets/rooms/room-4.jpeg';
import banner5 from '../../../assets/rooms/room-5.png';
import banner6 from '../../../assets/rooms/room-6.jpg';
import banner7 from '../../../assets/rooms/room-7.jpg';
import banner8 from '../../../assets/rooms/room-8.jpg';
import banner9 from '../../../assets/rooms/room-9.jpg';
import banner10 from '../../../assets/rooms/room-10.jpg';
import banner11 from '../../../assets/rooms/room-11.jpg';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate('/all-apartments');
  };

  return (
    <Carousel
      autoPlay={true}
      interval={2000}
      infiniteLoop={true}
      //       showThumbs={false}
      showStatus={false}
      onClickItem={handleItemClick}
    >
      <div>
        <img src={banner0} />
      </div>
      <div>
        <img src={banner1} />
      </div>
      <div>
        <img src={banner2} />
      </div>
      <div>
        <img src={banner3} />
      </div>
      <div>
        <img src={banner4} />
      </div>
      <div>
        <img src={banner5} />
      </div>
      <div>
        <img src={banner6} />
      </div>
      <div>
        <img src={banner7} />
      </div>
      <div>
        <img src={banner8} />
      </div>
      <div>
        <img src={banner9} />
      </div>
      <div>
        <img src={banner10} />
      </div>
      <div>
        <img src={banner11} />
      </div>
    </Carousel>
  );
};

export default Banner;
