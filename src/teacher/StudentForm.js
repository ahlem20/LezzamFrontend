import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';

Modal.setAppElement('#root'); // Set the root for accessibility

const StudentForm = ({ showModal, toggleModal }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [newStudents, setNewStudents] = useState([
    {
      username: '',
      password: '',
    },
  ]);

  // Retrieve teacher's username from localStorage
  const user = JSON.parse(localStorage.getItem('lezzam'));
  const [studentDetails, setStudentDetails] = useState({
    roles: ['Student'],
    University: '',
    College: '',
    Department: '',
    Specialization: '',
    groop: '',
    level: '',
    Scale: '',
    teacherName: user?.username || '',
  });

  // Handle changes in bulk student fields
  const handleStudentChange = (index, e) => {
    const updatedStudents = [...newStudents];
    updatedStudents[index][e.target.name] = e.target.value;
    setNewStudents(updatedStudents);
  };

  // Handle changes in shared details fields
  const handleDetailsChange = (e) => {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  };

  // Add a new student input field dynamically
  const addStudentField = () => {
    setNewStudents([...newStudents, { username: '', password: '' }]);
  };

  // Remove a student input field
  const removeStudentField = (index) => {
    const updatedStudents = [...newStudents];
    updatedStudents.splice(index, 1);
    setNewStudents(updatedStudents);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a payload for each student
      const studentsToCreate = newStudents.map((student) => ({
        ...studentDetails,
        username: student.username,
        password: student.password,
      }));

      // Send each student to the backend
      for (const student of studentsToCreate) {
        await axios.post(`${API_URL}user/students`, student);
      }

      toggleModal(); // Close modal
      navigate('/teacher'); // Redirect to /teacher
    } catch (error) {
      console.error('Error creating students:', error);
      alert('حدث خطأ أثناء إضافة الطلاب. حاول مرة أخرى.');
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={toggleModal}
      className="modal bg-white p-5 rounded-lg shadow-lg max-w-lg mx-auto mt-10"
    >
      <h2 className="text-xl font-bold mb-3">إضافة طلاب جدد</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-h-96 overflow-y-auto p-4 border-t border-gray-200"
        dir="rtl"
      >
        {/* Shared student details */}
        <div>
          <label className="block text-sm font-medium">الجامعة</label>
          <input
            type="text"
            name="University"
            value={studentDetails.University}
            onChange={handleDetailsChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">الكلية</label>
          <input
            type="text"
            name="College"
            value={studentDetails.College}
            onChange={handleDetailsChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">القسم</label>
          <input
            type="text"
            name="Department"
            value={studentDetails.Department}
            onChange={handleDetailsChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">التخصص</label>
          <input
            type="text"
            name="Specialization"
            value={studentDetails.Specialization}
            onChange={handleDetailsChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">المجموعة</label>
          <input
            type="text"
            name="groop"
            value={studentDetails.groop}
            onChange={handleDetailsChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">المستوى</label>
          <input
            type="text"
            name="level"
            value={studentDetails.level}
            onChange={handleDetailsChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">المقياس</label>
          <input
            type="text"
            name="Scale"
            value={studentDetails.Scale}
            onChange={handleDetailsChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">اسم المعلم</label>
          <input
            type="text"
            name="teacherName"
            value={studentDetails.teacherName}
            disabled
            className="border p-2 w-full"
          />
        </div>

        {/* Dynamic student input fields */}
        {newStudents.map((student, index) => (
          <div key={index} className="border p-3 mb-3 rounded bg-gray-100">
            <div>
              <label className="block text-sm font-medium">اسم المستخدم</label>
              <input
                type="text"
                name="username"
                value={student.username}
                onChange={(e) => handleStudentChange(index, e)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">كلمة المرور</label>
              <input
                type="password"
                name="password"
                value={student.password}
                onChange={(e) => handleStudentChange(index, e)}
                className="border p-2 w-full"
                required
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeStudentField(index)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              >
                إزالة
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addStudentField}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          إضافة طالب آخر
        </button>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-3"
        >
          إضافة الطلاب
        </button>
      </form>

      <button
        onClick={toggleModal}
        className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
      >
        إغلاق
      </button>
    </Modal>
  );
};

export default StudentForm;
