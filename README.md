# 🎓 School Management System

A **professional full-stack school management system** built with Node.js, Express, and vanilla JavaScript. Features modern UI design with in-memory data storage for quick development and testing.

![Made with Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

### 📊 Dashboard
- Real-time statistics for students, teachers, classes, and attendance
- Recent student overview with attendance percentages
- Upcoming exam schedule display

### 👨‍🎓 Student Management
- Complete CRUD operations (Create, Read, Update, Delete)
- Search functionality by name, class, or email
- Student information: Name, Age, Grade, Class, Phone, Email, Attendance %

### 👨‍🏫 Teacher Management
- Full CRUD operations for teacher records
- Teacher details: Name, Subject, Phone, Email, Salary, Experience
- Search and filter capabilities

### 📚 Class Management
- Card-based grid view for easy visualization
- Class details: Name, Grade, Section, Teacher, Student Count, Room Number
- Add, edit, and delete class records

### 📋 Attendance Tracking
- Mark daily attendance (Present/Late/Absent)
- Attendance history with search functionality
- Date-based attendance recording

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express.js
- **Storage**: In-memory arrays (resets on server restart)
- **API**: RESTful endpoints with CORS enabled
- **Port**: 3000 (bound to 0.0.0.0 for AWS EC2 compatibility)

### Frontend
- **Pure HTML/CSS/JavaScript** (no framework dependencies)
- **Design**: Modern gradient theme (purple/blue)
- **Icons**: Font Awesome 6
- **Responsive**: Mobile-friendly design

## 📂 Project Structure

```
/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   └── package.json       # Backend dependencies
├── public/
│   ├── index.html         # Dashboard page
│   ├── students.html      # Students management
│   ├── teachers.html      # Teachers management
│   ├── classes.html       # Classes management
│   ├── attendance.html    # Attendance tracking
│   ├── css/
│   │   └── style.css      # Professional styling
│   └── js/
│       ├── config.js      # API configuration
│       ├── dashboard.js   # Dashboard logic
│       ├── students.js    # Students logic
│       ├── teachers.js    # Teachers logic
│       ├── classes.js     # Classes logic
│       └── attendance.js  # Attendance logic
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/youssef3fifi/Mahmoud-shawkhy.git
cd Mahmoud-shawkhy
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Start the backend server**
```bash
npm start
```
The API server will start on `http://localhost:3000`

4. **Serve the frontend**

Open a new terminal and from the project root:
```bash
# Using Python 3
cd public
python3 -m http.server 8000

# OR using Python 2
python -m SimpleHTTPServer 8000

# OR using Node.js http-server
npm install -g http-server
http-server public -p 8000
```

5. **Access the application**
Open your browser and navigate to:
```
http://localhost:8000
```

## 🌐 AWS EC2 Deployment Guide

### Step 1: Launch EC2 Instance

1. **Create EC2 Instance**
   - Go to AWS Console → EC2 → Launch Instance
   - Choose **Ubuntu Server 22.04 LTS**
   - Instance type: **t2.micro** (free tier eligible)
   - Create or select a key pair
   - **Security Group**: Configure as follows:

   | Type | Protocol | Port Range | Source |
   |------|----------|-----------|--------|
   | SSH | TCP | 22 | Your IP |
   | HTTP | TCP | 80 | 0.0.0.0/0 |
   | Custom TCP | TCP | 3000 | 0.0.0.0/0 |

2. **Launch the instance** and note your **Public IPv4 Address**

### Step 2: Connect to EC2

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

### Step 3: Install Node.js and Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 4: Clone and Setup Backend

```bash
# Clone repository
cd /home/ubuntu
git clone https://github.com/youssef3fifi/Mahmoud-shawkhy.git
cd Mahmoud-shawkhy/backend

# Install dependencies
npm install

# Start backend with PM2
pm2 start server.js --name school-api
pm2 save
pm2 startup
```

### Step 5: Configure Frontend

1. **Update API Configuration**
```bash
cd /home/ubuntu/Mahmoud-shawkhy/public/js
nano config.js
```

Replace `YOUR_EC2_IP` with your actual EC2 IP address:
```javascript
AWS: 'http://YOUR_ACTUAL_EC2_IP:3000',
```

2. **Setup Nginx**
```bash
sudo nano /etc/nginx/sites-available/school-management
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name YOUR_EC2_IP;

    root /home/ubuntu/Mahmoud-shawkhy/public;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable the site**
```bash
sudo ln -s /etc/nginx/sites-available/school-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Verify Deployment

1. **Check PM2 status**
```bash
pm2 status
pm2 logs school-api
```

2. **Access your application**
```
http://YOUR_EC2_IP
```

## 📡 API Documentation

### Base URL
- **Local**: `http://localhost:3000/api`
- **AWS**: `http://YOUR_EC2_IP:3000/api`

### Endpoints

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard statistics |

#### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get student by ID |
| POST | `/students` | Create new student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

#### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teachers` | Get all teachers |
| GET | `/teachers/:id` | Get teacher by ID |
| POST | `/teachers` | Create new teacher |
| PUT | `/teachers/:id` | Update teacher |
| DELETE | `/teachers/:id` | Delete teacher |

#### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/classes` | Get all classes |
| GET | `/classes/:id` | Get class by ID |
| POST | `/classes` | Create new class |
| PUT | `/classes/:id` | Update class |
| DELETE | `/classes/:id` | Delete class |

#### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | Get all attendance records |
| GET | `/attendance/:id` | Get attendance by ID |
| POST | `/attendance` | Create attendance record |
| PUT | `/attendance/:id` | Update attendance |
| DELETE | `/attendance/:id` | Delete attendance |

#### Exams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exams` | Get all exams |

### Example API Request

```javascript
// Create a new student
fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'John Doe',
        age: 15,
        grade: '10th',
        class: 'Class A',
        phone: '01234567890',
        email: 'john@school.com',
        attendance: 95
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔧 Configuration

### Update EC2 IP Address

Edit `public/js/config.js`:
```javascript
const config = {
    LOCAL: 'http://localhost:3000',
    AWS: 'http://YOUR_EC2_IP:3000',  // Update this line
    
    getApiUrl: function() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.LOCAL;
        }
        return this.AWS;
    }
};
```

## 🛠️ Troubleshooting

### Backend not starting
```bash
# Check if port 3000 is in use
sudo lsof -i :3000

# Kill the process if needed
sudo kill -9 <PID>

# Restart the server
cd backend
npm start
```

### Frontend not connecting to API
1. Check if backend is running: `pm2 status`
2. Verify the IP address in `config.js`
3. Check browser console for CORS errors
4. Ensure security group allows port 3000

### Nginx errors
```bash
# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### PM2 issues
```bash
# View logs
pm2 logs school-api

# Restart application
pm2 restart school-api

# Delete and recreate
pm2 delete school-api
pm2 start server.js --name school-api
pm2 save
```

### EC2 Connection Issues
- Verify security group rules allow ports 22, 80, and 3000
- Check if EC2 instance is running
- Ensure your IP is whitelisted for SSH (port 22)

## 💾 Data Storage

**Important**: This application uses **in-memory storage**. All data is stored in JavaScript arrays and will be **lost when the server restarts**. This is intentional for development and testing purposes.

Pre-loaded sample data includes:
- 5 Students
- 4 Teachers
- 5 Classes
- 5 Attendance records
- 3 Upcoming exams

For production use, consider implementing a database like MongoDB, PostgreSQL, or MySQL.

## 🎨 Design Features

- **Modern Gradient Theme**: Purple and blue color scheme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions
- **Modal Forms**: Clean popup forms for data entry
- **Icon Integration**: Font Awesome icons throughout
- **Card-based UI**: Modern card layouts for better UX

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for school management