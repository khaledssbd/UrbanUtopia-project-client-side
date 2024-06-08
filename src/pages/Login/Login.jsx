import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import googleSvg from '../../assets/google.svg';
import facebookSvg from '../../assets/facebook.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import bgImg from '../../assets/rooms/room-1.jpg';
import xButtonSVG from '../../assets/x-button.svg';
import Swal from 'sweetalert2';
import Loading from '../../components/AllLootie/Loading';

const Login = () => {
  const {
    user,
    logIn,
    loading,
    setLoading,
    googleProvider,
    signInWithSocial,
    facebookProvider,
    getPassWordResetMail,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const [showForgotPassModal, setShowForgotPassModal] = useState(false);
  const [
    passWordResetMailSentConfirmation,
    setPassWordResetMailSentConfirmation,
  ] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    const form = e.target;

    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);
      await logIn(email, password);

      setLoading(false);
      navigate(from, { replace: true });
      toast.success('Successfully logged-in');

      // Swal.fire({
      //   title: 'Account logged-in successfully!',
      //   showClass: {
      //     popup: 'animate__animated animate__fadeInDown',
      //   },
      //   hideClass: {
      //     popup: 'animate__animated animate__fadeOutUp',
      //   },
      // });
    } catch (error) {
      setLoading(false);
      if (error.message === 'Firebase: Error (auth/invalid-credential).') {
        Swal.fire({
          title: 'Alert!',
          text: 'Email or password is wrong, try again or reset.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then(async result => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else if (
        error.message === 'Firebase: Error (auth/too-many-requests).'
      ) {
        Swal.fire({
          title: 'Alert!',
          text: 'Too many trial may ban your account. Verify email quickly.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then(async result => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          title: 'Alert!',
          text: 'An error occurred during login. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then(async result => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    }
  };

  const socialSignIn = async provider => {
    await signInWithSocial(provider);
    navigate(from, { replace: true });
    toast.success('Successfully logged-in');
  };

  const handlePasswordReset = async e => {
    e.preventDefault();
    const email = e.target.emailForPassReset.value;

    try {
      await getPassWordResetMail(email);
      setPassWordResetMailSentConfirmation(true);
    } catch (error) {
      Swal.fire('Alert!', error?.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-44">
        <Loading />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/"></Navigate>;
  }

  return (
    <div
      className="my-5 md:my-10 p-5 md:p-10"
      style={{
        borderRadius: '24px',
        background: `linear-gradient(0deg, rgba(21, 11, 43, 0.90) 0%, rgba(21, 11, 43, 0.40) 100%), url(${bgImg}) lightgray 0px -18.896px / 100% 123.31% no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: 'auto',
      }}
    >
      <Helmet>
        <title>UrbanUtopia | Login</title>
      </Helmet>
      <h2 className="my-10 text-xl sm:text-2xl md:text-3xl font-medium text-center text-white">
        Login
      </h2>
      <form onSubmit={handleLogin} className=" md:w-3/4 lg:w-1/2 mx-auto">
        <div className="form-control">
          <label className="label label-text text-white text-lg pb-1">
            Email
          </label>
          <input
            type="email"
            required
            name="email"
            ref={emailRef}
            placeholder="Your Email"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label label-text text-white text-lg pb-1 mt-3">
            Password
          </label>
          <div className="flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              name="password"
              placeholder="Your Password"
              className="input input-bordered w-full"
              autoComplete="true"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="-ml-10"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label className="label">
            <div
              onClick={() => setShowForgotPassModal(true)}
              className="label-text-alt link link-hover text-white text-sm"
            >
              Forgot password?
            </div>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary disabled:bg-gray-500">
            Login
          </button>
        </div>
      </form>
      <div className="">
        <h2 className="text-xl text-white mt-10 mb-4">Login With</h2>
        <div className="flex justify-center gap-8">
          <button
            onClick={() => {
              socialSignIn(googleProvider);
            }}
          >
            <img className="w-9" src={googleSvg} alt="Google" />
          </button>
          <button
            onClick={() => {
              socialSignIn(facebookProvider);
            }}
          >
            <img className="w-9" src={facebookSvg} alt="Facebook" />
          </button>
        </div>
      </div>
      <p className="text-center text-white mt-4">
        Do not have an account?
        <Link className="text-blue-600 font-bold ml-2" to="/register">
          Register
        </Link>
      </p>
      {showForgotPassModal && (
        <div
          style={{
            borderRadius: '24px',
            background:
              'linear-gradient(0deg, rgba(21, 11, 43, 0.90) 0%, rgba(21, 11, 43, 0.70) 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="fixed top-0 left-0 flex justify-center items-center h-screen w-full z-10"
        >
          <div className="w-full mx-3 sm:w-1/3 h-1/3 rounded-2xl bg-blue-400 text-center">
            <div className="card-actions justify-end">
              <button
                onClick={() => {
                  setShowForgotPassModal(false);
                  setPassWordResetMailSentConfirmation(false);
                }}
                className="btn btn-square btn-sm"
              >
                <img src={xButtonSVG} alt="close" />
              </button>
            </div>
            {passWordResetMailSentConfirmation ? (
              <div className="px-5 md:px-10 pt-10 xl:pt-16">
                <h3 className="text-black md:text-lg font-medium">
                  Password reset mail sent to the email. Check your inbox.
                </h3>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="px-5">
                <h3 className="mb-2 text-black text-xl font-bold md:mt-5">
                  Your Email
                </h3>
                <div className="form-control">
                  <input
                    type="email"
                    required
                    defaultValue={emailRef.current.value}
                    name="emailForPassReset"
                    placeholder="Enter your email"
                    className="input input-bordered"
                  />
                </div>
                <input
                  className="mt-2 sm:mt-4 md:mt-8 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer"
                  type="submit"
                  value="Get reset mail"
                />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
