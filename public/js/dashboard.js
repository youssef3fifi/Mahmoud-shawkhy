// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard/stats`);
        const data = await response.json();

        // Update stats
        document.getElementById('totalStudents').textContent = data.totalStudents;
        document.getElementById('totalTeachers').textContent = data.totalTeachers;
        document.getElementById('totalClasses').textContent = data.totalClasses;
        document.getElementById('avgAttendance').textContent = data.averageAttendance.toFixed(1) + '%';

        // Display recent students
        displayRecentStudents(data.recentStudents);

        // Display upcoming exams
        displayUpcomingExams(data.upcomingExams);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

function displayRecentStudents(students) {
    const container = document.getElementById('recentStudents');
    
    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No students yet</h3></div>';
        return;
    }

    container.innerHTML = students.map(student => `
        <div class="student-item">
            <div class="student-info">
                <h4>${student.name}</h4>
                <p>${student.grade} - ${student.class}</p>
            </div>
            <div class="attendance-badge">${student.attendance}%</div>
        </div>
    `).join('');
}

function displayUpcomingExams(exams) {
    const container = document.getElementById('upcomingExams');
    
    if (exams.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><h3>No upcoming exams</h3></div>';
        return;
    }

    container.innerHTML = exams.map(exam => `
        <div class="exam-card">
            <h3>${exam.subject}</h3>
            <div class="exam-details">
                <i class="fas fa-calendar"></i> ${exam.date}
            </div>
            <div class="exam-details">
                <i class="fas fa-clock"></i> ${exam.time}
            </div>
            <div class="exam-details">
                <i class="fas fa-book"></i> ${exam.class}
            </div>
            <div class="exam-details">
                <i class="fas fa-hourglass-half"></i> ${exam.duration}
            </div>
        </div>
    `).join('');
}

function showError(message) {
    const containers = ['recentStudents', 'upcomingExams'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
        }
    });
}
