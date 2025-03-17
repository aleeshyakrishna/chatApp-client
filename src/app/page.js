'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import api from '../../utils/baseUrl/baseUrl.js';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    const loadingToast = toast.loading("Logging in...");

    try {
      const response = await api.post('/user/user-login', { email, password });

      if (response.status === 200) {
        
        
        const { user, token } = response.data.data;
        dispatch(loginSuccess({token,user}));
        toast.success("Login successful!", { id: loadingToast });
        router.push('/chat')
      }
    } catch (error) {
      

      let errorMessage = "Something went wrong, please try again.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid request. Please check your input.";
            break;
          case 401:
            errorMessage = "Unauthorized! Invalid email or password.";
            break;
          case 403:
            errorMessage = "Forbidden! You do not have access.";
            break;
          case 404:
            errorMessage = "User not found!";
            break;
          case 500:
            errorMessage = "Server error! Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "An unknown error occurred.";
        }
      }

      toast.error(errorMessage, { id: loadingToast });

      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Login</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="text"
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
