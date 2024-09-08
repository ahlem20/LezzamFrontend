import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';

import { API_URL } from '../config/constants';
const ProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('lezzam'));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve token from local storage
        const response = await axios.get(`${API_URL}project/projects/student/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in the request headers
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.message : 'حدث خطأ أثناء جلب المشاريع');
      }
    };

    fetchProjects();
  }, [user._id]);

  const handleDownloadQR = (qrnumber) => {
    QRCode.toDataURL(qrnumber, { width: 300, margin: 2 }, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }

      saveAs(url, `${qrnumber}.png`); // Download the QR code as an image
    });
  };

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token from local storage
      await axios.delete(`${API_URL}project/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request headers
        },
      });

      // Update the state by removing the deleted project
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Error deleting project');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md" dir="rtl">
        <h1 className="text-3xl font-bold mb-6 text-center">المشاريع غير النشطة للطالب</h1>
        {error && <p className="text-red-500">{error}</p>}
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">العنوان</th>
              <th className="border border-gray-300 px-4 py-2">المقياس</th>
              <th className="border border-gray-300 px-4 py-2">الاستاذ</th>
              <th className="border border-gray-300 px-4 py-2">QR</th>
              <th className="border border-gray-300 px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="border border-gray-300 px-4 py-2">{project.title}</td>
                <td className="border border-gray-300 px-4 py-2">{project.scale}</td>
                <td className="border border-gray-300 px-4 py-2">{project.teacherName}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => handleDownloadQR(project.qrnumber)}
                  >
                    {project.qrnumber}
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="text-red-500 underline"
                    onClick={() => handleDelete(project._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;
