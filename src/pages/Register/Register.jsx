import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import googleSvg from '../../assets/google.svg';
import facebookSvg from '../../assets/facebook.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import bgImg from '../../assets/rooms/room-1.jpg';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import Loading from '../../components/AllLootie/Loading';
import axios from 'axios';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const image_hosting_key = import.meta.env.VITE_IMGBB_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
  const [registering, setRegistering] = useState(false);
  const axiosPublic = useAxiosPublic();

  const { register, handleSubmit, formState: { errors }} = useForm();

  const {
    user,
    logOut,
    createUser,
    signInWithSocial,
    googleProvider,
    facebookProvider,
    updateUserProfile,
  } = useAuth();

  const navigate = useNavigate();
  const [passError, setPassError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleRegister = async data => {
    const { name, email, image, password, confirmPassword } = data;
    setPassError('');

    if (password !== confirmPassword) {
      setPassError("Password and Confirm Password didn't match");
      return;
    }

    if (!isChecked) {
      return;
    }

    const formData = new FormData();
    formData.append('image', image[0]);

    try {
      setRegistering(true);
      const { data: info } = await axios.post(image_hosting_api, formData);
      const imageUrl = info.data.display_url;

      await createUser(email, password);
      await updateUserProfile(name, imageUrl);

      const userData = {
        name,
        email,
        accountCreatedAt: new Date(),
        role: 'user',
        floor: 'none',
        block: 'none',
        room: 'none',
      };
      const { data } = await axiosPublic.post('/user', userData);

      if (data.insertedId) {
        // await verifyUser(result.user);
        setRegistering(false);
        logOut();

        navigate('/login');
        Swal.fire({
          title: 'Account created!',
          text: 'Login Now!.',
          icon: 'success',
          showConfirmButton: false,
          timer: 7000,
        });
      }
    } catch (error) {
      setRegistering(false);
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        navigate('/login');
        Swal.fire('Alert!', 'Account already exists. Please log in.', 'error');
      } else if (error.message === 'Firebase: Error (auth/invalid-email).') {
        setEmailError('Must use a valid email address');
      } else {
        Swal.fire(
          'Alert!',
          'An error occurred during registration. Please try again.',
          'error'
        );
      }
    }
  };

  const socialSignIn = async provider => {
    setRegistering(true);
    await signInWithSocial(provider);

    const userData = {
      name: user?.displayName,
      email: user?.email,
      accountCreatedAt: new Date(),
      role: 'user',
      floor: 'none',
      block: 'none',
      room: 'none',
    };
    const { data } = await axiosPublic.post('/user', userData);

    if (data.insertedId) {
      setRegistering(false);
      navigate(location?.state ? location.state : '/');
      toast.success('Successfully registered');
    }
  };

  if (registering) {
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
        <title>UrbanUtopia | Register</title>
      </Helmet>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center text-white">
        Register
      </h2>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="md:w-3/4 lg:w-1/2 mx-auto"
      >
        <div className="form-control">
          <label className="label label-text text-white">Name</label>
          <input
            type="text"
            {...register('name', {
              required: {
                value: true,
                message: 'You must provide your name.',
              },
            })}
            placeholder="Your Name"
            className="input input-bordered"
            autoComplete="true"
          />
          {errors.name && (
            <small className="text-red-500 text-left mt-1">
              {errors.name.message}
            </small>
          )}
        </div>
        <div className="form-control">
          <label className="label label-text text-white mt-2">Email</label>
          <input
            type="email"
            {...register('email', {
              required: {
                value: true,
                message: 'You must provide your email.',
              },
              validate: {
                isValid: value => {
                  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return true;
                  }
                  return 'Must use a valid email address';
                },
              },
            })}
            placeholder="Your Email"
            className="input input-bordered"
            autoComplete="true"
          />
          {errors.email && (
            <small className="text-red-500 text-left mt-1">
              {errors.email.message}
            </small>
          )}
        </div>
        <div className="form-control">
          <label className="label label-text text-white mt-2">
            Select Image:
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('image', {
              required: {
                value: true,
                message: 'You must add your image.',
              },
            })}
            className="file-input w-full"
          />
          {errors.image && (
            <small className="text-red-500 text-left mt-1">
              {errors.image.message}
            </small>
          )}
        </div>

        <div className="form-control">
          <label className="label label-text text-white mt-2">Password</label>
          <div className="flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: {
                  value: true,
                  message: 'You must choose a password.',
                },
                minLength: {
                  value: 8,
                  message: 'Password must contain 8 characters!',
                },
                validate: {
                  isCapital: value => {
                    if (/(?=.*[A-Z])/.test(value)) {
                      return true;
                    }
                    return 'Password must have at least one Uppercase letter';
                  },
                  isLower: value => {
                    if (/(?=.*[a-z])/.test(value)) {
                      return true;
                    }
                    return 'Password must have at least one Lowercase letter';
                  },
                  isNumeric: value => {
                    if (/(?=.*\d{2,})/.test(value)) {
                      return true;
                    }
                    return 'Password must have at least 2 numbers';
                  },
                  isSpecialChar: value => {
                    if (
                      /(?=.*[!@#$%^&*()_+\-~=[\]{};'`:"\\|,.<>/?])/.test(value)
                    ) {
                      return true;
                    }
                    return 'Password must contain a symbol!';
                  },
                },
              })}
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
          {errors.password && (
            <small className="text-red-500 text-left mt-1">
              {errors.password.message}
            </small>
          )}
          {emailError && (
            <small className="text-red-500 text-left mt-1">{emailError}</small>
          )}
        </div>
        <div className="form-control">
          <label className="label label-text text-white mt-2">
            Confirm Password
          </label>
          <div className="flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: {
                  value: true,
                  message: 'You must provide your confirmed Password.',
                },
              })}
              placeholder="Confirmed Password"
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
          {errors.confirmPassword && (
            <small className="text-red-500 text-left mt-1">
              {errors.confirmPassword.message}
            </small>
          )}
          {passError && (
            <small className="text-red-500 text-left mt-1">{passError}</small>
          )}
          <div className="flex items-center justify-between">
            <div className="text-left pl-1 my-2">
              <input
                className="mr-1"
                onChange={event => setIsChecked(event.target.checked)}
                type="checkbox"
              />
              <small className="text-sm mt-1 text-white">
                Do you agree with our terms and conditions?
              </small>
            </div>
            {!isChecked && (
              <small className="text-red-500 mt-1">
                Please check on Terms and Conditions..
              </small>
            )}
          </div>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Register</button>
        </div>
      </form>
      <div className="">
        <h2 className="text-xl text-white mt-10 mb-4">Register With</h2>
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
        Already have an account?{' '}
        <Link className="text-blue-600 font-bold ml-2" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
