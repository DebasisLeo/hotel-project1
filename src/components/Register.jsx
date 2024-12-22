import React, { useContext, useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../firebase.init';
import { AuthContext } from './AuthProvider';

const Register = () => {
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const { createRegister, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.pass.value;
    const photoUrl = e.target.photoUrl.value;

    if (!terms) {
      toast.error('Please accept our terms and conditions.');
      return;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!regex.test(password)) {
      toast.error(
        'Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.'
      );
      return;
    }

    createRegister(email, password)
      .then((result) => {
        const user = result.user;
        return updateUser({
          displayName: name,
          photoURL: photoUrl,
        }).then(() => {
          toast.success('Registration successful!');
          e.target.reset();
          navigate('/');
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const provider = new GoogleAuthProvider();

  const handleGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success('Google Sign-In successful!');
        navigate('/');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-r from-purple-700 via-pink-500 to-red-500">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="hero-content flex-col">
        <h1
          className="text-5xl font-bold text-white text-center mb-6 animate__animated animate__fadeIn"
          data-aos="fade-down"
        >
          Create an Account
        </h1>
        <div
          className="card w-full max-w-md bg-white shadow-xl rounded-lg p-8 transform transition-all hover:scale-105"
          data-aos="fade-up"
        >
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label text-gray-600">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="input input-bordered focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="form-control">
              <label className="label text-gray-600">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="text"
                name="photoUrl"
                placeholder="Profile photo URL"
                className="input input-bordered focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="form-control">
              <label className="label text-gray-600">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="form-control relative">
              <label className="label text-gray-600">
                <span className="label-text">Password</span>
              </label>
              <input
                type={show ? 'text' : 'password'}
                name="pass"
                placeholder="Create a password"
                className="input input-bordered focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-10"
              >
                {show ? <FaEye className="text-gray-500" /> : <FaEyeSlash className="text-gray-500" />}
              </button>
            </div>
            <div className="form-control">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  onChange={(e) => setTerms(e.target.checked)}
                  className="checkbox"
                />
                <span>Accept Terms and Conditions</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg hover:from-purple-600 hover:to-red-600 transform hover:scale-105 transition-all"
            >
              Register
            </button>
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          </form>
          <div className="divider">OR</div>
          <button
            onClick={handleGoogle}
            className="flex items-center justify-center gap-2 w-full py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transform hover:scale-105 transition-all"
          >
            <FaGoogle />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;