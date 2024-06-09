import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="mt-30 bg-[#030712] py-5 md:py-10 px-5 md:px-20">
      <div className="flex justify-between items-center">
        <div className="mb-12 text-start">
          <Link
            to="/"
            className="btn btn-ghost hover:bg-white hover:text-black text-base md:text-4xl font-extrabold md:mb-4"
            data-aos="flip-up"
          >
            <button className="flex justify-center items-center gap-2 md:gap-3">
              <img className="w-5 md:w-8 rounded-lg" src="/logo.png" alt="" />
              <span className="bg-gradient-to-r from-primary to-red-500 text-transparent bg-clip-text">
                UrbanUtopia
              </span>
            </button>
          </Link>
          <p
            className="text-[#FFFFFFCC] text-sm md:text-lg font-normal"
            data-aos="zoom-out-right"
          >
            UrbanUtopia is the most popular building for your <br /> secured
            life arrangement.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="text-white text-xs sm:text-base md:text-xl font-semibold mb-2 md:mb-5">
            Social Links
          </h4>
          <div className="flex gap-4 text-xl md:text-3xl mb-3">
            <a
              href="https://www.facebook.com/mdkhaledsshuvo"
              className="text-[#1877F2] cursor-pointer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com/mdkhaledsshuvo"
              className="text-[#1DA1F2] cursor-pointer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/mdkhaledsshuvo"
              className="text-[#E1306C] cursor-pointer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/mdkhaledsshuvo"
              className="text-[#0077B5] cursor-pointer"
            >
              <FaLinkedin />
            </a>
          </div>
          <h4 className="text-white text-xs sm:text-sm">Address:-</h4>
          <h4 className="text-white text-xs sm:text-sm">
            UrbanUtopia, Academy Road, Feni Sadar, Feni.
          </h4>
          <h4 className="text-gray-300 text-xs sm:text-sm">
            Email: khaled@PH.com
          </h4>
        </div>
      </div>
      <hr />
      <div className="mt-8 flex justify-between items-center">
        <div>
          <h5 className="text-white hidden sm:flex font-normal">
            Copyright © 2024 - All right reserved by UrbanUtopia
          </h5>
        </div>
        <div className="flex gap-8">
          <div>
            <h5 className="text-white text-sm md:text-base font-medium">
              Terms & condition
            </h5>
          </div>
          <div>
            <h5 className="text-white text-sm md:text-base font-medium">
              Return & refund policy
            </h5>
          </div>
          <div>
            <h5 className="text-white text-sm md:text-base font-medium">
              Privacy policy
            </h5>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <h5 className="text-[#FFFFFFB2] flex sm:hidden font-normal text-sm md:text-sm">
          Copyright © 2024 - All right reserved by UrbanUtopia
        </h5>
      </div>
    </footer>
  );
};

export default Footer;
