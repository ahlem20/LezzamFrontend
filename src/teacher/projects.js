import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

const NonActiveProjectsTable = () => {
    const user = JSON.parse(localStorage.getItem('lezzam')); // Get user from localStorage
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false); // State to handle the form pop-up
    const [newProject, setNewProject] = useState({ title: '', scale: '', teacherName: user.username }); // Form data

    // Fetch non-active text projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}project/projects/teacher/${user.username}/non-active`);
                
                // Ensure the response is an array
                if (Array.isArray(response.data)) {
                    setProjects(response.data);
                } else {
                    setProjects([]); // Set to an empty array if the response isn't an array
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user.username]);

    // Handle form submission for creating a new project
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('${API_URL}project/projects/text', newProject);
            console.log('New project created:', response.data);
            setShowForm(false); // Close the popup after submission
            setNewProject({ title: '', scale: '', teacherName: user.username }); // Reset form
            setProjects([...projects, response.data]); // Optionally add the new project to the table
        } catch (err) {
            console.error('Error creating project:', err.response?.data?.message || err.message);
        }
    };

    // Handle project deletion for text projects
    const handleDelete = async (projectId) => {
        try {
            await axios.delete(`${API_URL}project/projects/${projectId}`);
            setProjects(projects.filter((project) => project._id !== projectId)); // Remove the deleted project from state
        } catch (err) {
            console.error('Error deleting project:', err.response?.data?.message || err.message);
        }
    };

    if (loading) return <div>جار التحميل...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div dir="rtl" className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">المشاريع غير النشطة للمعلم {user.username}</h1>
            
            {/* Button to open the popup form */}
            <button
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowForm(true)}
            >
                إضافة مشروع جديد
            </button>

            {/* Project Table */}
            <table className="table-auto w-full text-right border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-4 py-2">العنوان</th>
                        <th className="border border-gray-400 px-4 py-2">المقياس</th>
                        <th className="border border-gray-400 px-4 py-2">اسم المعلم</th>
                        <th className="border border-gray-400 px-4 py-2">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <tr key={project._id} className="hover:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">{project.title}</td>
                                <td className="border border-gray-400 px-4 py-2">{project.scale}</td>
                                <td className="border border-gray-400 px-4 py-2">{project.teacherName}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                        onClick={() => handleDelete(project._id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">لم يتم العثور على مشاريع</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Popup form for creating a new project */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">إنشاء مشروع جديد</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">العنوان</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">المقياس</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded"
                                    value={newProject.scale}
                                    onChange={(e) => setNewProject({ ...newProject, scale: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    إنشاء مشروع
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={() => setShowForm(false)}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NonActiveProjectsTable;
