// Teachers management functionality
let teachersData = [];
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    loadTeachers();
    setupSearchFilter();
    setupFormSubmit();
});

async function loadTeachers() {
    try {
        const response = await fetch(`${API_URL}/api/teachers`);
        teachersData = await response.json();
        displayTeachers(teachersData);
    } catch (error) {
        console.error('Error loading teachers:', error);
        showError('Failed to load teachers data');
    }
}

function displayTeachers(teachers) {
    const tbody = document.getElementById('teachersTable');
    
    if (teachers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;"><div class="empty-state"><i class="fas fa-chalkboard-teacher"></i><h3>No teachers found</h3></div></td></tr>';
        return;
    }

    tbody.innerHTML = teachers.map(teacher => `
        <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.phone}</td>
            <td>${teacher.email}</td>
            <td>$${teacher.salary}</td>
            <td>${teacher.experience} years</td>
            <td class="actions">
                <button class="btn btn-warning btn-sm" onclick="editTeacher(${teacher.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTeacher(${teacher.id})">
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
        const filtered = teachersData.filter(teacher => 
            teacher.name.toLowerCase().includes(searchTerm) ||
            teacher.subject.toLowerCase().includes(searchTerm) ||
            teacher.email.toLowerCase().includes(searchTerm)
        );
        displayTeachers(filtered);
    });
}

function openAddModal() {
    isEditMode = false;
    document.getElementById('modalTitle').textContent = 'Add Teacher';
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherId').value = '';
    document.getElementById('teacherModal').classList.add('active');
}

function editTeacher(id) {
    isEditMode = true;
    const teacher = teachersData.find(t => t.id === id);
    
    if (!teacher) return;

    document.getElementById('modalTitle').textContent = 'Edit Teacher';
    document.getElementById('teacherId').value = teacher.id;
    document.getElementById('name').value = teacher.name;
    document.getElementById('subject').value = teacher.subject;
    document.getElementById('phone').value = teacher.phone;
    document.getElementById('email').value = teacher.email;
    document.getElementById('salary').value = teacher.salary;
    document.getElementById('experience').value = teacher.experience;
    
    document.getElementById('teacherModal').classList.add('active');
}

function closeModal() {
    document.getElementById('teacherModal').classList.remove('active');
}

function setupFormSubmit() {
    document.getElementById('teacherForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const teacherData = {
            name: document.getElementById('name').value,
            subject: document.getElementById('subject').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            salary: parseInt(document.getElementById('salary').value),
            experience: parseInt(document.getElementById('experience').value)
        };

        try {
            let response;
            if (isEditMode) {
                const id = document.getElementById('teacherId').value;
                response = await fetch(`${API_URL}/api/teachers/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(teacherData)
                });
            } else {
                response = await fetch(`${API_URL}/api/teachers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(teacherData)
                });
            }

            if (response.ok) {
                closeModal();
                loadTeachers();
                showSuccess(isEditMode ? 'Teacher updated successfully' : 'Teacher added successfully');
            } else {
                showError('Failed to save teacher');
            }
        } catch (error) {
            console.error('Error saving teacher:', error);
            showError('Failed to save teacher');
        }
    });
}

async function deleteTeacher(id) {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
        const response = await fetch(`${API_URL}/api/teachers/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTeachers();
            showSuccess('Teacher deleted successfully');
        } else {
            showError('Failed to delete teacher');
        }
    } catch (error) {
        console.error('Error deleting teacher:', error);
        showError('Failed to delete teacher');
    }
}

function showSuccess(message) {
    alert(message);
}

function showError(message) {
    alert('Error: ' + message);
}
