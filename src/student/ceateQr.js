import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';

const CreateProject = () => {
  const navigate = useNavigate(); // For navigation

  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState([]); // Initialize as an empty array
  const [projects, setProjects] = useState([]); // Store project data (titles, scales)
  const [isFileTooLarge, setIsFileTooLarge] = useState(false); // Track if the file exceeds 5MB
  const [formData, setFormData] = useState({
    title: '',
    pdfFile: null, // For file uploads
    scale: '',
    teacherName: '',
  });

  const user = JSON.parse(localStorage.getItem('lezzam'));

  // Fetch teacher names when component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${API_URL}user/teacherNames/${user._id}`);
        
        // Ensure the data is an array
        const data = Array.isArray(response.data) ? response.data : [response.data];

        setTeachers(data); // Set the response data (array of teachers)
      } catch (error) {
        console.error('Error fetching teacher names:', error);
        setError('خطأ في جلب أسماء المعلمين.');
      }
    };
    fetchTeachers();
  }, [user._id]);

  // Fetch project data (title, scale) based on selected teacherName
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (formData.teacherName) {
        try {
          const response = await axios.get(
            `${API_URL}project/projects/teacher/${formData.teacherName}/non-active`
          );
          setProjects(response.data || []); // Ensure projects are set as an array
        } catch (error) {
          console.error('Error fetching project details:', error);
          setError('خطأ في جلب بيانات المشروع.');
        }
      }
    };
    fetchProjectDetails();
  }, [formData.teacherName]); // Fetch details whenever teacherName changes

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      // Check if the file size is greater than 5 MB
      if (file && file.size > 5 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 5 ميجا بايت.');
        setIsFileTooLarge(true); // Set the flag to true if the file is too large
        setFormData({
          ...formData,
          pdfFile: null, // Reset file if it's too large
        });
      } else {
        setError(''); // Clear any previous error
        setIsFileTooLarge(false); // File size is valid
        setFormData({
          ...formData,
          pdfFile: file, // Set the file if size is valid
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = new FormData();
    projectData.append('studentId', user._id); // Automatically take user._id for studentId
    projectData.append('title', formData.title);
    projectData.append('scale', formData.scale);
    projectData.append('teacherName', formData.teacherName);
    projectData.append('pdf', formData.pdfFile); // Attach the PDF file

    try {
      // Make the API request
      const response = await axios.post(`${API_URL}/project/projects`, projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // If the project is successfully created, navigate to /student
        navigate('/student');
      } else {
        setError(response.data.message || 'خطأ في إنشاء المشروع');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ أثناء إنشاء المشروع.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">إنشاء مشروع جديد</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">اسم المعلم</label>
            <select
              name="teacherName"
              value={formData.teacherName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">اختر المعلم</option>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher.teacherName}>
                    {teacher.teacherName}
                  </option>
                ))
              ) : (
                <option value="">لا يوجد معلمون</option>
              )}
            </select>
          </div>
          
          {/* Title Selector */}
          <div className="mb-4">
            <label className="block text-gray-700">العنوان</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">اختر العنوان</option>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <option key={project._id} value={project.title}>
                    {project.title}
                  </option>
                ))
              ) : (
                <option value="">لا يوجد مشاريع</option>
              )}
            </select>
          </div>
          
          {/* Scale Selector */}
          <div className="mb-4">
            <label className="block text-gray-700">التقييم</label>
            <select
              name="scale"
              value={formData.scale}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">اختر التقييم</option>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <option key={project._id} value={project.scale}>
                    {project.scale}
                  </option>
                ))
              ) : (
                <option value="">لا يوجد تقييمات</option>
              )}
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">ملف PDF</label>
            <input
              type="file"
              name="pdfFile"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white py-2 px-4 rounded ${isFileTooLarge ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
            disabled={isFileTooLarge}
          >
            إنشاء مشروع
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
