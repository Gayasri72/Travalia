import React, { useState } from 'react';
import login from '../assets/userManagement/login.png';
import icon1 from '../assets/userManagement/icon1.png';
import icon2 from '../assets/userManagement/icon2.png';
import icon3 from '../assets/userManagement/icon3.png';
import lock from '../assets/userManagement/lock.png';
import email from '../assets/userManagement/email.png';
import google from '../assets/userManagement/google.png';
import fingerprintIcon from '../assets/userManagement/fingerprint.png';
import { Button, Spinner, Alert } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessages, setErrorMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessages('Please fill in all fields');
    }
    try {
      setLoading(true);
      setErrorMessages(null);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (data.success === false) {
        return setErrorMessages(data.message);
      }
      setLoading(false);

      if (res.ok) {
        navigate('/');
      }
    } catch (error) {
      setErrorMessages(error.message);
      setLoading(false);
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
        <img
          src={icon1}
          alt="Plane Icon"
          className="absolute top-4 right-0 w-80 h-20 mt-1"
        />
        <h2 className="text-5xl font-bold text-blue-600 -mt-20">Welcome</h2>
        <p className="mt-2 text-gray-500">Login with Email</p>

        <form className="w-full mt-6" onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-700">Email</label>
            <div className="relative">
              <img
                src={email}
                alt="Email Icon"
                className="absolute left-3 top-3 w-5 h-5"
              />
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
              <img
                src={lock}
                alt="Password Icon"
                className="absolute left-3 top-3 w-5 h-5"
              />
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

          {errorMessages && (
            <Alert className="mt-5" color="failure">
              {errorMessages}
            </Alert>
          )}
        </form>

        <div className="flex items-center w-full my-6 ">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="w-full flex justify-center gap-4">
          <button className="flex items-center justify-center bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 transition w-1/2">
            <img src={google} alt="Google" className="w-6 mr-2" />
            Google
          </button>
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
