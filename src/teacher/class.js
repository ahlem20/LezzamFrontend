import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';
import { API_URL } from '../config/constants';
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-3/4 h-3/4 overflow-auto">
        <button className="float-right text-red-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

const StudentTable = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [studentProjects, setStudentProjects] = useState([]);
  const [note, setNote] = useState(''); // State to handle the note input
  const [selectedProjectId, setSelectedProjectId] = useState(null); // State to store the selected project ID

  // Function to handle note change
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  // Fetch the teacher's username from localStorage
  const user = JSON.parse(localStorage.getItem('lezzam'));
  const username = user?.username;

  // Open and close student form modal
  const toggleFormModal = () => setShowFormModal(!showFormModal);

  // Fetch the unique class information (without duplicates) when the component loads
  useEffect(() => {
    if (username) {
      axios
        .get(`${API_URL}user/students?teacherName=${username}`)
        .then((response) => {
          const uniqueClasses = getUniqueClasses(response.data);
          setClasses(uniqueClasses);
        })
        .catch((err) => console.error(err));
    }
  }, [username]);

  // Function to get unique classes based on University, College, Department, Specialization, Group, Level, and Scale
  const getUniqueClasses = (students) => {
    const unique = [];
    const classSet = new Set();

    students.forEach((student) => {
      const classInfo = `${student.University}-${student.College}-${student.Department}-${student.Specialization}-${student.groop}-${student.level}-${student.Scale}`;

      if (!classSet.has(classInfo)) {
        classSet.add(classInfo);
        unique.push(student);
      }
    });

    return unique;
  };

  // Fetch students of the same class when a row is clicked
  const fetchStudentsByClass = (classData) => {
    const { University, College, Department, Specialization, level, groop, Scale } = classData;
    axios
      .post('${API_URL}user/students/class', {
        University,
        College,
        Department,
        Specialization,
        level,
        groop,
        Scale,
      })
      .then((response) => {
        setStudents(response.data);
        setSelectedClass(classData);
        setIsModalOpen(true); // Open the modal when class is selected
      })
      .catch((err) => console.error(err));
  };

  // Fetch the student project details when a student row is clicked
  const fetchStudentProjects = (studentId) => {
    axios
      .get(`${API_URL}project/active/${username}/${studentId}`)
      .then((response) => {
        setStudentProjects(response.data);
        setIsProjectModalOpen(true); // Open the project modal
      })
      .catch((err) => console.error(err));
  };
 // Function to add a note to the selected project
 const addNoteToProject = (projectId) => {
  if (!note) {
    alert('Please enter a note');
    return;
  }

  axios
    .patch(`${API_URL}project/projects/${projectId}/note`, { note })
    .then((response) => {
      alert('Note added successfully');
      // Update the project list or refresh the note in the UI after adding
      const updatedProjects = studentProjects.map((project) =>
        project._id === projectId ? { ...project, note: response.data.project.note } : project
      );
      setStudentProjects(updatedProjects);
      setNote(''); // Clear the note input
    })
    .catch((err) => console.error(err));
};
  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">الطلاب في الصف</h1>
      
      {/* Button to show Student Form modal */}
      <button
        onClick={toggleFormModal}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        إضافة طالب
      </button>
      
      <StudentForm showModal={showFormModal} toggleModal={toggleFormModal} />

      {/* Class Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2">الجامعة</th>
            <th className="px-4 py-2">الكلية</th>
            <th className="px-4 py-2">القسم</th>
            <th className="px-4 py-2">التخصص</th>
            <th className="px-4 py-2">المجموعة</th>
            <th className="px-4 py-2">المستوى</th>
            <th className="px-4 py-2">الدرجة</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classData) => (
            <tr
              key={`${classData.University}-${classData.College}-${classData.Department}-${classData.Specialization}-${classData.groop}-${classData.level}-${classData.Scale}`}
              className="cursor-pointer"
              onClick={() => fetchStudentsByClass(classData)}
            >
              <td className="border px-4 py-2">{classData.University}</td>
              <td className="border px-4 py-2">{classData.College}</td>
              <td className="border px-4 py-2">{classData.Department}</td>
              <td className="border px-4 py-2">{classData.Specialization}</td>
              <td className="border px-4 py-2">{classData.groop}</td>
              <td className="border px-4 py-2">{classData.level}</td>
              <td className="border px-4 py-2">{classData.Scale}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to show students in the selected class */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-3">
          الطلاب في {selectedClass?.University} - {selectedClass?.College}
        </h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2">اسم الطالب</th>
              <th className="px-4 py-2">الجامعة</th>
              <th className="px-4 py-2">الكلية</th>
              <th className="px-4 py-2">القسم</th>
              <th className="px-4 py-2">التخصص</th>
              <th className="px-4 py-2">المجموعة</th>
              <th className="px-4 py-2">المستوى</th>
              <th className="px-4 py-2">الدرجة</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="cursor-pointer"
                onClick={() => fetchStudentProjects(student._id)}
              >
                <td className="border px-4 py-2">{student.username}</td>
                <td className="border px-4 py-2">{student.University}</td>
                <td className="border px-4 py-2">{student.College}</td>
                <td className="border px-4 py-2">{student.Department}</td>
                <td className="border px-4 py-2">{student.Specialization}</td>
                <td className="border px-4 py-2">{student.groop}</td>
                <td className="border px-4 py-2">{student.level}</td>
                <td className="border px-4 py-2">{student.Scale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>

      {/* Modal to show student projects */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)}>
      <h2 className="text-xl font-bold mb-3">مشاريع الطالب</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2">العنوان</th>
            <th className="px-4 py-2">الدرجة</th>
            <th className="px-4 py-2">QR الرقم</th>
            <th className="px-4 py-2">PDF</th>
            <th className="px-4 py-2">الملاحظة</th> {/* New column for notes */}
            <th className="px-4 py-2">إضافة ملاحظة</th> {/* New column for adding notes */}
          </tr>
        </thead>
        <tbody>
          {studentProjects.map((project) => (
            <tr key={project._id}>
              <td className="border px-4 py-2">{project.title}</td>
              <td className="border px-4 py-2">{project.scale}</td>
              <td className="border px-4 py-2">{project.qrnumber}</td>
              <td className="border px-4 py-2">
                {project.pdf ? (
                 <a
                 href={`${API_URL}project/get-pdf/${project._id}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-blue-500 underline"
               >
                    عرض
                  </a>
                ) : (
                  'لا'
                )}
              </td>
              <td className="border px-4 py-2">{project.note || 'لا توجد ملاحظات'}</td> {/* Display note */}
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={note}
                  onChange={handleNoteChange}
                  placeholder="أضف ملاحظة"
                  className="border p-2 rounded"
                />
                <button
                  onClick={() => addNoteToProject(project._id)} // Call function to add note
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  إضافة
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
    </div>
  );
};

export default StudentTable;
