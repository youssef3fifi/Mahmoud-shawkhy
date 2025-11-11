const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Storage
let students = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    age: 15,
    grade: '10th',
    class: 'Class A',
    phone: '01234567890',
    email: 'ahmed@school.com',
    attendance: 95
  },
  {
    id: 2,
    name: 'Fatima Ali',
    age: 16,
    grade: '11th',
    class: 'Class B',
    phone: '01234567891',
    email: 'fatima@school.com',
    attendance: 92
  },
  {
    id: 3,
    name: 'Mohamed Salem',
    age: 14,
    grade: '9th',
    class: 'Class C',
    phone: '01234567892',
    email: 'mohamed@school.com',
    attendance: 88
  },
  {
    id: 4,
    name: 'Sara Ibrahim',
    age: 15,
    grade: '10th',
    class: 'Class A',
    phone: '01234567893',
    email: 'sara@school.com',
    attendance: 97
  },
  {
    id: 5,
    name: 'Omar Khalil',
    age: 16,
    grade: '11th',
    class: 'Class B',
    phone: '01234567894',
    email: 'omar@school.com',
    attendance: 90
  }
];

let teachers = [
  {
    id: 1,
    name: 'Dr. Mahmoud Shawky',
    subject: 'Mathematics',
    phone: '01098765432',
    email: 'mahmoud@school.com',
    salary: 15000,
    experience: 10
  },
  {
    id: 2,
    name: 'Mrs. Nadia Ahmed',
    subject: 'English',
    phone: '01098765433',
    email: 'nadia@school.com',
    salary: 12000,
    experience: 7
  },
  {
    id: 3,
    name: 'Mr. Hassan Ali',
    subject: 'Science',
    phone: '01098765434',
    email: 'hassan@school.com',
    salary: 13000,
    experience: 8
  },
  {
    id: 4,
    name: 'Mrs. Laila Mohamed',
    subject: 'History',
    phone: '01098765435',
    email: 'laila@school.com',
    salary: 11000,
    experience: 5
  }
];

let classes = [
  {
    id: 1,
    name: 'Class A',
    grade: '10th',
    section: 'A',
    teacher: 'Dr. Mahmoud Shawky',
    students: 32,
    room: '101'
  },
  {
    id: 2,
    name: 'Class B',
    grade: '11th',
    section: 'B',
    teacher: 'Mrs. Nadia Ahmed',
    students: 28,
    room: '102'
  },
  {
    id: 3,
    name: 'Class C',
    grade: '9th',
    section: 'C',
    teacher: 'Mr. Hassan Ali',
    students: 30,
    room: '103'
  },
  {
    id: 4,
    name: 'Class D',
    grade: '10th',
    section: 'D',
    teacher: 'Mrs. Laila Mohamed',
    students: 25,
    room: '104'
  },
  {
    id: 5,
    name: 'Class E',
    grade: '11th',
    section: 'E',
    teacher: 'Dr. Mahmoud Shawky',
    students: 27,
    room: '105'
  }
];

let attendance = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Ahmed Hassan',
    date: '2024-01-15',
    status: 'Present',
    class: 'Class A'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Fatima Ali',
    date: '2024-01-15',
    status: 'Present',
    class: 'Class B'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Mohamed Salem',
    date: '2024-01-15',
    status: 'Late',
    class: 'Class C'
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Sara Ibrahim',
    date: '2024-01-15',
    status: 'Present',
    class: 'Class A'
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'Omar Khalil',
    date: '2024-01-15',
    status: 'Absent',
    class: 'Class B'
  }
];

let exams = [
  {
    id: 1,
    subject: 'Mathematics',
    date: '2024-01-20',
    time: '09:00 AM',
    class: 'Class A',
    duration: '2 hours'
  },
  {
    id: 2,
    subject: 'English',
    date: '2024-01-22',
    time: '10:00 AM',
    class: 'Class B',
    duration: '1.5 hours'
  },
  {
    id: 3,
    subject: 'Science',
    date: '2024-01-25',
    time: '11:00 AM',
    class: 'Class C',
    duration: '2 hours'
  }
];

// Helper function to get next ID
const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

// Dashboard Stats API
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalClasses: classes.length,
    averageAttendance: students.reduce((sum, s) => sum + s.attendance, 0) / students.length || 0,
    recentStudents: students.slice(-3).reverse(),
    upcomingExams: exams
  };
  res.json(stats);
});

// Students API
app.get('/api/students', (req, res) => {
  res.json(students);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

app.post('/api/students', (req, res) => {
  const newStudent = {
    id: getNextId(students),
    ...req.body
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    students[index] = { ...students[index], ...req.body, id: students[index].id };
    res.json(students[index]);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    students.splice(index, 1);
    res.json({ message: 'Student deleted successfully' });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// Teachers API
app.get('/api/teachers', (req, res) => {
  res.json(teachers);
});

app.get('/api/teachers/:id', (req, res) => {
  const teacher = teachers.find(t => t.id === parseInt(req.params.id));
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

app.post('/api/teachers', (req, res) => {
  const newTeacher = {
    id: getNextId(teachers),
    ...req.body
  };
  teachers.push(newTeacher);
  res.status(201).json(newTeacher);
});

app.put('/api/teachers/:id', (req, res) => {
  const index = teachers.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...req.body, id: teachers[index].id };
    res.json(teachers[index]);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

app.delete('/api/teachers/:id', (req, res) => {
  const index = teachers.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    teachers.splice(index, 1);
    res.json({ message: 'Teacher deleted successfully' });
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

// Classes API
app.get('/api/classes', (req, res) => {
  res.json(classes);
});

app.get('/api/classes/:id', (req, res) => {
  const classItem = classes.find(c => c.id === parseInt(req.params.id));
  if (classItem) {
    res.json(classItem);
  } else {
    res.status(404).json({ message: 'Class not found' });
  }
});

app.post('/api/classes', (req, res) => {
  const newClass = {
    id: getNextId(classes),
    ...req.body
  };
  classes.push(newClass);
  res.status(201).json(newClass);
});

app.put('/api/classes/:id', (req, res) => {
  const index = classes.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    classes[index] = { ...classes[index], ...req.body, id: classes[index].id };
    res.json(classes[index]);
  } else {
    res.status(404).json({ message: 'Class not found' });
  }
});

app.delete('/api/classes/:id', (req, res) => {
  const index = classes.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    classes.splice(index, 1);
    res.json({ message: 'Class deleted successfully' });
  } else {
    res.status(404).json({ message: 'Class not found' });
  }
});

// Attendance API
app.get('/api/attendance', (req, res) => {
  res.json(attendance);
});

app.get('/api/attendance/:id', (req, res) => {
  const record = attendance.find(a => a.id === parseInt(req.params.id));
  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
});

app.post('/api/attendance', (req, res) => {
  const newAttendance = {
    id: getNextId(attendance),
    ...req.body
  };
  attendance.push(newAttendance);
  res.status(201).json(newAttendance);
});

app.put('/api/attendance/:id', (req, res) => {
  const index = attendance.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    attendance[index] = { ...attendance[index], ...req.body, id: attendance[index].id };
    res.json(attendance[index]);
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
});

app.delete('/api/attendance/:id', (req, res) => {
  const index = attendance.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    attendance.splice(index, 1);
    res.json({ message: 'Attendance record deleted successfully' });
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
});

// Exams API
app.get('/api/exams', (req, res) => {
  res.json(exams);
});

// Start server - Bind to 0.0.0.0 for AWS EC2 compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 School Management API server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`👨‍🎓 Students: http://localhost:${PORT}/api/students`);
  console.log(`👨‍🏫 Teachers: http://localhost:${PORT}/api/teachers`);
  console.log(`📚 Classes: http://localhost:${PORT}/api/classes`);
  console.log(`📋 Attendance: http://localhost:${PORT}/api/attendance`);
});
