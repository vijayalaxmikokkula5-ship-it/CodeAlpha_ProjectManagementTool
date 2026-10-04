const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Project = require("./Project");
const Task = require("./Task");
const Comment = require("./Comment");
const User = require("./User");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==============================
// HOME
// ==============================

app.get("/", (req, res) => {
  res.json({
    message: "Project Management Tool Backend is running!"
  });
});

// ==============================
// AUTHENTICATION
// ==============================

// REGISTER USER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// LOGIN USER
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || "project_management_secret_2026",
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

// ==============================
// PROJECT APIs
// ==============================

// CREATE PROJECT
app.post("/api/projects", async (req, res) => {
  try {
    const project = new Project(req.body);

    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create project",
      error: error.message
    });
  }
});

// GET ALL PROJECTS
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message
    });
  }
});

// ==============================
// TASK APIs
// ==============================

// CREATE TASK
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);

    const savedTask = await task.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create task",
      error: error.message
    });
  }
});

// GET ALL TASKS
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("projectId", "name")
      .sort({
        createdAt: -1
      });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
});

// UPDATE TASK STATUS
app.put("/api/tasks/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Get all tasks belonging to this project
    const projectTasks = await Task.find({
      projectId: updatedTask.projectId
    });

    // Calculate project progress
    const completedTasks = projectTasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const progress =
      projectTasks.length > 0
        ? Math.round(
            (completedTasks / projectTasks.length) * 100
          )
        : 0;

    // Update project progress
    await Project.findByIdAndUpdate(
      updatedTask.projectId,
      {
        progress: progress
      },
      {
        new: true
      }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update task status",
      error: error.message
    });
  }
});

// ==============================
// COMMENT APIs
// ==============================

// CREATE COMMENT
app.post("/api/comments", async (req, res) => {
  try {
    const comment = new Comment(req.body);

    const savedComment = await comment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create comment",
      error: error.message
    });
  }
});

// GET COMMENTS FOR A TASK
app.get("/api/comments/:taskId", async (req, res) => {
  try {
    const comments = await Comment.find({
      taskId: req.params.taskId
    }).sort({
      createdAt: 1
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message
    });
  }
});

// ==============================
// MONGODB CONNECTION
// ==============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });