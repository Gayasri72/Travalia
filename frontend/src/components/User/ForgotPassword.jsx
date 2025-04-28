import React, { useState } from 'react';
import { Button, Alert } from 'flowbite-react';
import { AiOutlineLock } from 'react-icons/ai';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      setMessage('Password updated successfully.');
      setTimeout(() => navigate('/sign-in'), 2000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="password"
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>

          {message && (
            <Alert className="mt-4" color="success">
              {message}
            </Alert>
          )}
          {error && (
            <Alert className="mt-4" color="failure">
              {error}
            </Alert>
          )}
        </form>

        <div className="mt-4 text-center">
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
