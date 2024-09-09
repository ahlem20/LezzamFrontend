import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";

import { API_URL } from '../config/constants';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('lezzam'));

  console.log('User:', user); // Add this line to debug

  const handleLogout = async () => {
    try {
      // Send a request to the logout endpoint
      const response = await fetch(`${API_URL}auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.accessToken}`, // If using JWT for authentication
        },
      });

      if (response.ok) {
        // Successfully logged out
        localStorage.removeItem('lezzam');
        navigate('/login');
      } else {
        // Handle errors (e.g., display an error message)
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: 'url("./background.jpg")' }}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0553B1] to-[#027DFD] text-white py-4 px-8 flex justify-between items-center shadow-lg">
       
        <div
          onClick={handleLogout}
          className="flex items-center text-white py-2 px-4 rounded shadow-md cursor-pointer transition duration-300 hover:bg-[#0366d6]"
        >
          <CiLogout className=" text-white text-2xl" />
        </div>
        <div className="text-lg font-semibold tracking-wide">
          أهلاً, {user?.username || 'المستخدم'}
        </div>
      </header>

      <div className="text-center text-5xl text-white mt-32 ">
        حقيبة الطالب
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-12 flex justify-center items-center text-right">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Button 1 */}
         <Link to='/note'><div
            className="bg-cover bg-center bg-no-repeat text-white text-center py-12 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 flex justify-center items-center"
            style={{
              backgroundImage: 'url("./background.jpg")',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold"> قائمة العلامات</h2>
          </div></Link> 

          {/* Button 2 */}
          <Link to='/list'>
          <div
            className="bg-cover bg-center bg-no-repeat text-white text-center py-12 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 flex justify-center items-center"
            style={{
              backgroundImage: 'url("./background.jpg")',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">قائمة المراجع</h2>
          </div></Link>

          {/* Button 3 */}
          <Link to='/qr'>
          <div
            className="bg-cover bg-center bg-no-repeat text-white text-center py-12 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 flex justify-center items-center"
            style={{
              backgroundImage: 'url("./background.jpg")',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold"> انشاء مرجع</h2>
          </div></Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
