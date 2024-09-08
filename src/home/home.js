import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{backgroundImage: 'url("./background.jpg")'}}>
      {/* Overlay to improve text visibility */}
      <div className="absolute inset-0 bg-blue-500 opacity-30"></div>
      
      {/* Hero Section */}
      <div className="text-white text-center z-10">
        {/* Logo */}
        <img src="./logo.png" alt="Logo" className="h-32 mb-14 mx-auto" />
<h1 className="text-4xl text-center text-blue-500 font-extrabold mb-4">lezzam  لزام</h1>
        <h1 className="text-5xl font-extrabold mb-4">اكتشف عالمًا جديد من التدريس والتعلم</h1>
        <p className="text-lg mb-8">في منصتنا الرائعة</p>

        {/* Buttons as Links */}
        <div className="space-x-4">
          <Link to="/login">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded-full">
              ابدأ  الأن
            </button>
          </Link>
      
        </div>
        
        {/* Additional Details */}
        <div className="mt-8">
          <p className="text-lg mt-8">تقدم لك منصتنا الفرصة لاكتساب المعرفة وتبادلها بين المعلمين و الطلاب.</p>
          <p className="text-lg">انضم إلينا اليوم وابدأ رحلتك في عالم التعلم الإلكتروني.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;