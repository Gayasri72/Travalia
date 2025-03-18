import React, { useState } from 'react';
import login from '../assets/userManagement/login.png';
import icon1 from '../assets/userManagement/icon1.png';
import icon2 from '../assets/userManagement/icon2.png';
import icon3 from '../assets/userManagement/icon3.png';

import fingerprintIcon from '../assets/userManagement/fingerprint.png';
import { Button, Spinner, Alert } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/User/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessages } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image and Quote */}
      <div
        className="hidden md:flex flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${login})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl font-bold">TRAVALIA</h1>
          <p className="mt-4 text-lg">
            Travel is the only purchase that enriches you in ways beyond
            material wealth
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 md:p-16 bg-white shadow-lg relative">
        <div className="flex flex-col items-center justify-center w-full">
          <img
            src={icon1}
            alt="Plane Icon"
            className="absolute top-4 right-0 w-80 h-20 mt-1"
          />
          <h2 className="text-5xl font-bold text-blue-600 -mt-20">Welcome</h2>
          <p className="mt-2 text-gray-500">Login with Email</p>
        </div>

        <form className="w-full mt-6" onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-700">Email</label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-3 w-5 h-5" />
              <input
                id="email"
                type="email"
                className="w-full pl-10 px-4 py-2 mt-1 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="example@email.com"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 w-5 h-5" />
              <input
                id="password"
                type="password"
                className="w-full pl-10 px-4 py-2 mt-1 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="********"
                onChange={handleChange}
              />
            </div>
          </div>

          <Link to="/forgot-password" className="text-right text-blue-600">
            Forgot your password?
          </Link>

          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="w-full mt-4 h-11"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="relative w-full">
            {errorMessages && (
              <Alert className="absolute top-2 left-0 w-full" color="failure">
                {errorMessages}
              </Alert>
            )}
          </div>
        </form>

        <div className="flex items-center w-full my-6 ">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="w-full flex justify-center gap-4">
          <OAuth />
          <button className="flex items-center justify-center bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 transition w-1/2">
            <img src={fingerprintIcon} alt="Fingerprint" className="w-6 mr-2" />
            Fingerprint
          </button>
        </div>

        <p className="mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-blue-600">
            Register Now
          </Link>
        </p>

        <img
          src={icon2}
          alt="Left Icon"
          className="absolute bottom-0 left-0 w-36 h-36"
        />
        <img
          src={icon3}
          alt="Right Icon"
          className="absolute bottom-0 right-0 w-36 h-36 "
        />
      </div>
    </div>
  );
}
