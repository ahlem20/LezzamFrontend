import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

const NonActiveProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('lezzam'));
        const studentId = user._id;
        const response = await axios.get(`${API_URL}project/projects/active/student/${studentId}`);
        setProjects(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-white text-center">جارٍ التحميل...</p>;
  if (error) return <p className="text-red-500 text-center">خطأ: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md" dir="rtl">
        <h1 className="text-3xl font-bold mb-6 text-center">علامات المشاريع </h1>
        {error && <p className="text-red-500">{error}</p>}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md text-right">
          <thead>
            <tr className="table-auto w-full border-collapse border border-gray-300">
              <th className="border border-gray-300 px-4 py-2">العلامة</th>
              <th className="border border-gray-300 px-4 py-2">العنوان</th>
              <th className="border border-gray-300 px-4 py-2">الدرجة</th>
              <th className="border border-gray-300 px-4 py-2">اسم المعلم</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="border border-gray-300 px-4 py-2">{project.note || 'لا يوجد ملاحظة'}</td>
                <td className="border border-gray-300 px-4 py-2">{project.title}</td>
                <td className="border border-gray-300 px-4 py-2">{project.scale}</td>
                <td className="border border-gray-300 px-4 py-2">{project.teacherName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NonActiveProjectsTable;
