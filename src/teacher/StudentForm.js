import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { API_URL } from '../config/constants';

Modal.setAppElement('#root'); // Set app root for modal

const StudentForm = ({ showModal, toggleModal }) => {
  const [newStudents, setNewStudents] = useState([{ username: '', password: '' }]);
  const navigate = useNavigate(); // Initialize useNavigate

  // استرجاع اسم المستخدم للمعلم من LocalStorage
  const user = JSON.parse(localStorage.getItem('lezzam'));
  const username = user?.username;
  const [studentDetails, setStudentDetails] = useState({
    roles: ['Student'],
    University: '',
    College: '',
    Department: '',
    Specialization: '',
    groop: '',
    level: '',
    Scale: '',
    teacherName: user?.username,
  });

  const handleStudentChange = (index, e) => {
    const updatedStudents = [...newStudents];
    updatedStudents[index][e.target.name] = e.target.value;
    setNewStudents(updatedStudents);
  };

  const handleDetailsChange = (e) => {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  };

  const addStudentField = () => {
    setNewStudents([...newStudents, { username: '', password: '' }]);
  };

  const removeStudentField = (index) => {
    const updatedStudents = [...newStudents];
    updatedStudents.splice(index, 1);
    setNewStudents(updatedStudents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentsToCreate = newStudents.map((student) => ({
        ...studentDetails,
        username: student.username,
        password: student.password,
      }));

      for (const student of studentsToCreate) {
        await axios.post(`${API_URL}user/students`, student);
      }

      toggleModal(); // Close modal
      navigate('/teacher'); // Redirect to /teacher
    } catch (error) {
      console.error(error);
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
        {/* Other student details inputs */}
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
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-3">
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
