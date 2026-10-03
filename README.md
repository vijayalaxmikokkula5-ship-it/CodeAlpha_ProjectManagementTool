# CodeAlpha Project Management Tool

A full-stack Project Management Tool developed as part of the CodeAlpha Full Stack Development Internship.

## 📌 Project Overview

ProjectFlow is a web-based project management application that helps users create and manage projects, organize tasks, track progress, and communicate through task comments.

The application provides a simple dashboard for monitoring project progress and task status.

## ✨ Features

- User Registration and Login
- JWT-based authentication
- Create and manage projects
- Set project start date and deadline
- Track project status
- Automatic project progress calculation
- Create and manage tasks
- Assign tasks to users
- Set task priority
- Set task due dates
- Update task status
- Add comments to tasks
- Dashboard with project and task statistics
- Responsive user interface
- MongoDB database integration

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcrypt.js

### Development Tools
- Visual Studio Code
- Git
- GitHub

## 📂 Project Structure

```text
CodeAlpha_ProjectManagementTool/
│
├── backend/
│   ├── Comment.js
│   ├── Project.js
│   ├── Task.js
│   ├── User.js
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Auth.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
│
├── .gitignore
└── README.md
