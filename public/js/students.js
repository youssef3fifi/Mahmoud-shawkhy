// Students management functionality
let studentsData = [];
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    setupSearchFilter();
    setupFormSubmit();
});

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/api/students`);
        studentsData = await response.json();
        displayStudents(studentsData);
    } catch (error) {
        console.error('Error loading students:', error);
        showError('Failed to load students data');
    }
}

function displayStudents(students) {
    const tbody = document.getElementById('studentsTable');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;"><div class="empty-state"><i class="fas fa-user-slash"></i><h3>No students found</h3></div></td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
            <td>${student.class}</td>
            <td>${student.phone}</td>
            <td>${student.email}</td>
            <td>${student.attendance}%</td>
            <td class="actions">
                <button class="btn btn-warning btn-sm" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = studentsData.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.class.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm)
        );
        displayStudents(filtered);
    });
}

function openAddModal() {
    isEditMode = false;
    document.getElementById('modalTitle').textContent = 'Add Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('studentModal').classList.add('active');
}

function editStudent(id) {
    isEditMode = true;
    const student = studentsData.find(s => s.id === id);
    
    if (!student) return;

    document.getElementById('modalTitle').textContent = 'Edit Student';
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('age').value = student.age;
    document.getElementById('grade').value = student.grade;
    document.getElementById('class').value = student.class;
    document.getElementById('phone').value = student.phone;
    document.getElementById('email').value = student.email;
    document.getElementById('attendance').value = student.attendance;
    
    document.getElementById('studentModal').classList.add('active');
}

function closeModal() {
    document.getElementById('studentModal').classList.remove('active');
}

function setupFormSubmit() {
    document.getElementById('studentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const studentData = {
            name: document.getElementById('name').value,
            age: parseInt(document.getElementById('age').value),
            grade: document.getElementById('grade').value,
            class: document.getElementById('class').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            attendance: parseInt(document.getElementById('attendance').value)
        };

        try {
            let response;
            if (isEditMode) {
                const id = document.getElementById('studentId').value;
                response = await fetch(`${API_URL}/api/students/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentData)
                });
            } else {
                response = await fetch(`${API_URL}/api/students`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentData)
                });
            }

            if (response.ok) {
                closeModal();
                loadStudents();
                showSuccess(isEditMode ? 'Student updated successfully' : 'Student added successfully');
            } else {
                showError('Failed to save student');
            }
        } catch (error) {
            console.error('Error saving student:', error);
            showError('Failed to save student');
        }
    });
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        const response = await fetch(`${API_URL}/api/students/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadStudents();
            showSuccess('Student deleted successfully');
        } else {
            showError('Failed to delete student');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showError('Failed to delete student');
    }
}

function showSuccess(message) {
    // Simple alert for now - can be enhanced with a toast notification
    alert(message);
}

function showError(message) {
    alert('Error: ' + message);
}
