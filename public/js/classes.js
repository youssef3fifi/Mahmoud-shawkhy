// Classes management functionality
let classesData = [];
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    loadClasses();
    setupSearchFilter();
    setupFormSubmit();
});

async function loadClasses() {
    try {
        const response = await fetch(`${API_URL}/api/classes`);
        classesData = await response.json();
        displayClasses(classesData);
    } catch (error) {
        console.error('Error loading classes:', error);
        showError('Failed to load classes data');
    }
}

function displayClasses(classes) {
    const grid = document.getElementById('classesGrid');
    
    if (classes.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1 / -1;"><div class="empty-state"><i class="fas fa-book"></i><h3>No classes found</h3></div></div>';
        return;
    }

    grid.innerHTML = classes.map(classItem => `
        <div class="class-card">
            <h3>${classItem.name}</h3>
            <div class="class-info">
                <i class="fas fa-graduation-cap"></i> Grade: ${classItem.grade}
            </div>
            <div class="class-info">
                <i class="fas fa-tag"></i> Section: ${classItem.section}
            </div>
            <div class="class-info">
                <i class="fas fa-chalkboard-teacher"></i> Teacher: ${classItem.teacher}
            </div>
            <div class="class-info">
                <i class="fas fa-users"></i> Students: ${classItem.students}
            </div>
            <div class="class-info">
                <i class="fas fa-door-open"></i> Room: ${classItem.room}
            </div>
            <div class="class-actions">
                <button class="btn btn-warning btn-sm" onclick="editClass(${classItem.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteClass(${classItem.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = classesData.filter(classItem => 
            classItem.name.toLowerCase().includes(searchTerm) ||
            classItem.grade.toLowerCase().includes(searchTerm) ||
            classItem.teacher.toLowerCase().includes(searchTerm)
        );
        displayClasses(filtered);
    });
}

function openAddModal() {
    isEditMode = false;
    document.getElementById('modalTitle').textContent = 'Add Class';
    document.getElementById('classForm').reset();
    document.getElementById('classId').value = '';
    document.getElementById('classModal').classList.add('active');
}

function editClass(id) {
    isEditMode = true;
    const classItem = classesData.find(c => c.id === id);
    
    if (!classItem) return;

    document.getElementById('modalTitle').textContent = 'Edit Class';
    document.getElementById('classId').value = classItem.id;
    document.getElementById('name').value = classItem.name;
    document.getElementById('grade').value = classItem.grade;
    document.getElementById('section').value = classItem.section;
    document.getElementById('teacher').value = classItem.teacher;
    document.getElementById('students').value = classItem.students;
    document.getElementById('room').value = classItem.room;
    
    document.getElementById('classModal').classList.add('active');
}

function closeModal() {
    document.getElementById('classModal').classList.remove('active');
}

function setupFormSubmit() {
    document.getElementById('classForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const classData = {
            name: document.getElementById('name').value,
            grade: document.getElementById('grade').value,
            section: document.getElementById('section').value,
            teacher: document.getElementById('teacher').value,
            students: parseInt(document.getElementById('students').value),
            room: document.getElementById('room').value
        };

        try {
            let response;
            if (isEditMode) {
                const id = document.getElementById('classId').value;
                response = await fetch(`${API_URL}/api/classes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(classData)
                });
            } else {
                response = await fetch(`${API_URL}/api/classes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(classData)
                });
            }

            if (response.ok) {
                closeModal();
                loadClasses();
                showSuccess(isEditMode ? 'Class updated successfully' : 'Class added successfully');
            } else {
                showError('Failed to save class');
            }
        } catch (error) {
            console.error('Error saving class:', error);
            showError('Failed to save class');
        }
    });
}

async function deleteClass(id) {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
        const response = await fetch(`${API_URL}/api/classes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadClasses();
            showSuccess('Class deleted successfully');
        } else {
            showError('Failed to delete class');
        }
    } catch (error) {
        console.error('Error deleting class:', error);
        showError('Failed to delete class');
    }
}

function showSuccess(message) {
    alert(message);
}

function showError(message) {
    alert('Error: ' + message);
}
