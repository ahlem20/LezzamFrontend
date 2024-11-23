import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';
import Sub from './sub';
const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Student');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Updated to useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}auth/signup`, {
        username,
        password,
        email,
        phoneNumber,
        description,
      });

      if (response.status === 201) {
        navigate('/login'); // Updated to use navigate
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during signup');
    }
  };

  return (
    <div
    dir='rtl'
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: 'url("./background.jpg")' }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">إنشاء حساب</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <Sub/>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="أدخل رقم الهاتف"
              required
            />
          </div>
       
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">الوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="أدخل وصفك"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-medium text-lg hover:bg-blue-700 transition duration-300"
          >
            إنشاء حساب
          </button>
          <p className="mt-4 text-center">
            <a
              href="/login"
              className="text-green-600 font-medium text-lg hover:underline transition duration-300"
            >
              مشترك بالفعل؟
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
