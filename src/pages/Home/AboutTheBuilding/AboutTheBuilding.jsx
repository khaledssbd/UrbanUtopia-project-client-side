import { Typewriter } from 'react-simple-typewriter';
import featuredImg from '../../../assets/rooms/room-2.jpg';

const AboutTheBuilding = () => {
  
  return (
    <section
      className="py-10 my-20 bg-fixed"
      style={{ backgroundImage: `url(${featuredImg})` }}
    >
      <div className="py-20 px-8 md:px-36 bg-white w-4/5 mx-auto rounded-md">
        <h1 className="text-3xl md:text-5xl mb-8 text-black">UrbanUtopia</h1>

        <h3 className="text-justify">
          <span style={{ color: 'green', fontWeight: 'normal' }}>
            <Typewriter
              words={[
                'UrbanUtopia offers a seamless and secured staying opportunity. With          automated billing, and community engagement features, it simplifies          property management. Enjoy convenience, efficiency, and robust security with our UrbanUtopia.',
              ]}
              loop={50}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={25}
              delaySpeed={1000}
            />
          </span>
        </h3>
      </div>
    </section>
  );
};

export default AboutTheBuilding;
