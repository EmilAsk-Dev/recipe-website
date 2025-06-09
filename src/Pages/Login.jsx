import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(
        `http://localhost:5000/users?username=${form.username}&password=${form.password}`
      );
      if (res.data.length > 0) {
        console.log("Login successful:", res.data[0]);
        setUser(res.data[0]);
        localStorage.setItem('user', JSON.stringify(res.data[0]));
        window.location.href = '/menu';
      }
      else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Server error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>

        <label className="block mb-2 font-medium text-gray-700">Username</label>
        <input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        {error && (
          <p className="text-red-600 mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-600 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
