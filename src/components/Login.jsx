import React, { useContext, useState, useEffect } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { auth } from '../../firebase.init';
import { AuthContext } from './AuthProvider';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const password = e.target.pass.value;

    loginUser(email, password)
      .then(() => {
        e.target.reset();
        toast.success('Login successful!');
        navigate(location?.state ? location.state : "/");
       
      })
      .catch((error) => {
        console.error(error.message);
        toast.error('Invalid email or password. Please try again.');
      });
  };

  const handleGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate(location?.state ? location.state : "/");
        toast.success('Logged in with Google!');
      })
      .catch((error) => {
        console.error(error.message);
        toast.error('Google sign-in failed. Please try again.');
      });
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left" data-aos="fade-left">
          <h1 className="text-5xl font-bold text-white mb-6">Welcome Back!</h1>
          <p className="text-lg text-gray-100">
            Login to access your account and start exploring new opportunities.
          </p>
        </div>
        <div className="card w-full max-w-sm bg-white shadow-xl rounded-lg p-8" data-aos="fade-up">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered focus:ring focus:ring-purple-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="pass"
                placeholder="Enter your password"
                className="input input-bordered focus:ring focus:ring-purple-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-600"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="form-control">
              <Link
                to="/auth/forgot-password"
                state={{ email }}
                className="text-sm text-purple-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="btn bg-gradient-to-r from-purple-500 to-indigo-500 text-white w-full hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              Login
            </button>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-500 hover:underline">
                Register
              </Link>
            </p>
          </form>
          <div className="divider">OR</div>
          <button
            onClick={handleGoogle}
            className="btn flex items-center justify-center gap-2 bg-red-500 text-white w-full hover:bg-red-600 transition-all"
          >
            <FaGoogle className="text-lg" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;