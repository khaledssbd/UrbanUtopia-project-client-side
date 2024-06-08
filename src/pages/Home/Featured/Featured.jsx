import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import featuredImg from '../../../assets/rooms/room-1.jpg';

const Featured = () => {
  return (
    <section
      style={{
        backgroundImage: `url(${featuredImg})`,
      }}
      className="text-white bg-fixed bg-center bg-cover"
    >
      <div className="py-10 my-20 bg-black bg-opacity-50">
        <SectionTitle heading="FROM OUR MENU" subHeading="---Check it out---" />
        <div className="md:flex justify-center items-center pb-20 pt-12 px-36 text-justify">
          <div>
            <img src={featuredImg} alt="" />
          </div>
          <div className="md:ml-16">
            <p>March 20, 2023</p>
            <p className="uppercase">WHERE CAN I GET SOME?</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
              corporis est dolores aut eos aperiam asperiores, voluptate error,
              doloribus quisquam perspiciatis sapiente, labore tenetur. Sint
              aliquid minus magni, quae reiciendis voluptatibus exercitationem
              repellendus consectetur explicabo consequuntur error tempore, ex
              magnam?
            </p>
            <button className="btn btn-outline uppercase text-white border-0 border-b-4">
              Read More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featured;
