// Attendance tracking functionality
let studentsData = [];
let attendanceData = [];
let attendanceStatus = {}; // {studentId: status}

document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
    
    loadStudents();
    loadAttendanceHistory();
    setupSearchFilter();
});

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/api/students`);
        studentsData = await response.json();
        displayAttendanceList(studentsData);
    } catch (error) {
        console.error('Error loading students:', error);
        showError('Failed to load students data');
    }
}

function displayAttendanceList(students) {
    const container = document.getElementById('attendanceList');
    
    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><h3>No students to mark attendance</h3></div>';
        return;
    }

    container.innerHTML = students.map(student => `
        <div class="attendance-item">
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-class">${student.class} - ${student.grade}</div>
            </div>
            <div class="status-buttons">
                <button class="status-btn ${attendanceStatus[student.id] === 'Present' ? 'active present' : ''}" 
                        onclick="markStatus(${student.id}, 'Present')">
                    <i class="fas fa-check"></i> Present
                </button>
                <button class="status-btn ${attendanceStatus[student.id] === 'Late' ? 'active late' : ''}" 
                        onclick="markStatus(${student.id}, 'Late')">
                    <i class="fas fa-clock"></i> Late
                </button>
                <button class="status-btn ${attendanceStatus[student.id] === 'Absent' ? 'active absent' : ''}" 
                        onclick="markStatus(${student.id}, 'Absent')">
                    <i class="fas fa-times"></i> Absent
                </button>
            </div>
        </div>
    `).join('');
}

function markStatus(studentId, status) {
    attendanceStatus[studentId] = status;
    displayAttendanceList(studentsData);
}

async function saveAttendance() {
    const date = document.getElementById('attendanceDate').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }

    const records = [];
    for (const [studentId, status] of Object.entries(attendanceStatus)) {
        const student = studentsData.find(s => s.id === parseInt(studentId));
        if (student) {
            records.push({
                studentId: student.id,
                studentName: student.name,
                class: student.class,
                date: date,
                status: status
            });
        }
    }

    if (records.length === 0) {
        alert('Please mark attendance for at least one student');
        return;
    }

    try {
        // Save each attendance record
        for (const record of records) {
            await fetch(`${API_URL}/api/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });
        }

        alert('Attendance saved successfully!');
        attendanceStatus = {};
        displayAttendanceList(studentsData);
        loadAttendanceHistory();
    } catch (error) {
        console.error('Error saving attendance:', error);
        alert('Error: Failed to save attendance');
    }
}

async function loadAttendanceHistory() {
    try {
        const response = await fetch(`${API_URL}/api/attendance`);
        attendanceData = await response.json();
        displayAttendanceHistory(attendanceData);
    } catch (error) {
        console.error('Error loading attendance history:', error);
        showError('Failed to load attendance history');
    }
}

function displayAttendanceHistory(records) {
    const tbody = document.getElementById('attendanceHistory');
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;"><div class="empty-state"><i class="fas fa-clipboard"></i><h3>No attendance records found</h3></div></td></tr>';
        return;
    }

    // Sort by date descending
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = records.map(record => {
        let statusClass = '';
        if (record.status === 'Present') statusClass = 'text-success';
        else if (record.status === 'Late') statusClass = 'text-warning';
        else if (record.status === 'Absent') statusClass = 'text-danger';

        return `
            <tr>
                <td>${record.id}</td>
                <td>${record.studentName}</td>
                <td>${record.class}</td>
                <td>${record.date}</td>
                <td><span class="${statusClass}" style="font-weight: 600;">${record.status}</span></td>
                <td class="actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteAttendance(${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = attendanceData.filter(record => 
            record.studentName.toLowerCase().includes(searchTerm) ||
            record.class.toLowerCase().includes(searchTerm)
        );
        displayAttendanceHistory(filtered);
    });
}

async function deleteAttendance(id) {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;

    try {
        const response = await fetch(`${API_URL}/api/attendance/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadAttendanceHistory();
            alert('Attendance record deleted successfully');
        } else {
            alert('Error: Failed to delete attendance record');
        }
    } catch (error) {
        console.error('Error deleting attendance:', error);
        alert('Error: Failed to delete attendance record');
    }
}

function showError(message) {
    alert('Error: ' + message);
}
