import { useEffect, useState } from "react";
import Auth from "./Auth";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activePage, setActivePage] = useState("Dashboard");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentAuthor, setCommentAuthor] = useState({});

  const [project, setProject] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: ""
  });

  const [task, setTask] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: ""
  });

  // ==============================
  // FETCH PROJECTS
  // ==============================

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "https://codealpha-projectflow-backend.onrender.com/api/projects"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // ==============================
  // FETCH TASKS
  // ==============================

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://codealpha-projectflow-backend.onrender.com/api/tasks"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      setTasks(data);

      data.forEach((item) => {
        fetchComments(item._id);
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ==============================
  // FETCH COMMENTS
  // ==============================

  const fetchComments = async (taskId) => {
    try {
      const response = await fetch(
        `https://codealpha-projectflow-backend.onrender.com/api/comments/${taskId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      setComments((previous) => ({
        ...previous,
        [taskId]: data
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTasks();
    }
  }, [user]);

  // ==============================
  // PROJECT INPUT
  // ==============================

  const handleProjectInputChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  };

  // ==============================
  // TASK INPUT
  // ==============================

  const handleTaskInputChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  // ==============================
  // CREATE PROJECT
  // ==============================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://codealpha-projectflow-backend.onrender.com/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(project)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create project"
        );
      }

      alert("Project created successfully!");

      setProject({
        name: "",
        description: "",
        startDate: "",
        deadline: ""
      });

      setShowProjectForm(false);

      fetchProjects();
    } catch (error) {
      alert(error.message);
    }
  };

  // ==============================
  // CREATE TASK
  // ==============================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!task.projectId) {
      alert("Please select a project.");
      return;
    }

    try {
      const response = await fetch(
        "https://codealpha-projectflow-backend.onrender.com/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(task)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create task"
        );
      }

      alert("Task created successfully!");

      setTask({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: ""
      });

      setShowTaskForm(false);

      fetchTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  // ==============================
  // UPDATE TASK STATUS
  // ==============================

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(
        `https://codealpha-projectflow-backend.onrender.com/api/tasks/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task status"
        );
      }

      await fetchTasks();
await fetchProjects();
    } catch (error) {
      alert(error.message);
    }
  };

  // ==============================
  // COMMENT INPUT
  // ==============================

  const handleCommentTextChange = (taskId, value) => {
    setCommentText((previous) => ({
      ...previous,
      [taskId]: value
    }));
  };

  const handleCommentAuthorChange = (taskId, value) => {
    setCommentAuthor((previous) => ({
      ...previous,
      [taskId]: value
    }));
  };

  // ==============================
  // CREATE COMMENT
  // ==============================

  const handleAddComment = async (taskId) => {
    const text = commentText[taskId]?.trim();
    const author = commentAuthor[taskId]?.trim();

    if (!author) {
      alert("Please enter your name.");
      return;
    }

    if (!text) {
      alert("Please enter a comment.");
      return;
    }
try {
  const response = await fetch(
    "https://codealpha-projectflow-backend.onrender.com/api/comments",
    {
      method: "POST",
      headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            taskId,
            author,
            text
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add comment"
        );
      }

      setCommentText((previous) => ({
        ...previous,
        [taskId]: ""
      }));

      fetchComments(taskId);
    } catch (error) {
      alert(error.message);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setActivePage("Dashboard");
  };

  // ==============================
  // AUTH
  // ==============================

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="app">

      {/* ==============================
          NAVBAR
      ============================== */}

      <header className="navbar">

        <h1>ProjectFlow</h1>

        <nav>

          <button
            onClick={() => setActivePage("Dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActivePage("Projects")}
          >
            Projects
          </button>

          <button
            onClick={() => setActivePage("Tasks")}
          >
            Tasks
          </button>

        </nav>

        <button
          className="profile-btn"
          onClick={() => setActivePage("Profile")}
        >
          Profile
        </button>

      </header>

      {/* ==============================
          MAIN CONTENT
      ============================== */}

      <main className="dashboard">

        <div className="welcome">

          <div>

            <h2>{activePage}</h2>

            <p>
              {activePage === "Dashboard"
                ? "Manage your projects, tasks, and team in one place."
                : `You are viewing the ${activePage} section.`}
            </p>

          </div>

          {activePage === "Dashboard" && (
            <button
              className="create-btn"
              onClick={() => setShowProjectForm(true)}
            >
              + Create Project
            </button>
          )}

          {activePage === "Projects" && (
            <button
              className="create-btn"
              onClick={() => setShowProjectForm(true)}
            >
              + Create Project
            </button>
          )}

          {activePage === "Tasks" && (
            <button
              className="create-btn"
              onClick={() => setShowTaskForm(true)}
            >
              + Create Task
            </button>
          )}

        </div>

        {/* ==============================
            DASHBOARD
        ============================== */}

        {activePage === "Dashboard" && (
          <>

            <section className="stats">

              <div className="stat-card">
                <h3>{projects.length}</h3>
                <p>Total Projects</p>
              </div>

              <div className="stat-card">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
              </div>

              <div className="stat-card">
                <h3>
                  {
                    tasks.filter(
                      (item) =>
                        item.status === "Completed"
                    ).length
                  }
                </h3>
                <p>Completed Tasks</p>
              </div>

              <div className="stat-card">
                <h3>
                  {
                    tasks.filter(
                      (item) =>
                        item.status !== "Completed"
                    ).length
                  }
                </h3>
                <p>Pending Tasks</p>
              </div>

            </section>

            <section className="projects-section">

              <div className="section-heading">

                <h2>My Projects</h2>

                <button
                  onClick={() =>
                    setActivePage("Projects")
                  }
                >
                  View All
                </button>

              </div>

              <div className="project-grid">

                {projects.length === 0 ? (
                  <p>No projects found.</p>
                ) : (
                  projects.slice(0, 3).map((item) => (
                    <div
                      className="project-card"
                      key={item._id}
                    >

                      <h3>{item.name}</h3>

                      <p>{item.description}</p>

                      <div className="progress">

                        <div
                          className="progress-bar"
                          style={{
                            width: `${item.progress}%`
                          }}
                        />

                      </div>

                      <span>
                        {item.progress}% completed
                      </span>

                    </div>
                  ))
                )}

              </div>

            </section>

          </>
        )}

        {/* ==============================
            PROJECTS
        ============================== */}

        {activePage === "Projects" && (
          <section className="projects-section">

            <div className="section-heading">
              <h2>All Projects</h2>
            </div>

            <div className="project-grid">

              {projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                projects.map((item) => (
                  <div
                    className="project-card"
                    key={item._id}
                  >

                    <h3>{item.name}</h3>

                    <p>{item.description}</p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {item.status}
                    </p>

                    <p>
                      <strong>Deadline:</strong>{" "}
                      {item.deadline
                        ? new Date(
                            item.deadline
                          ).toLocaleDateString()
                        : "Not set"}
                    </p>

                    <div className="progress">

                      <div
                        className="progress-bar"
                        style={{
                          width: `${item.progress}%`
                        }}
                      />

                    </div>

                    <span>
                      {item.progress}% completed
                    </span>

                  </div>
                ))
              )}

            </div>

          </section>
        )}

        {/* ==============================
            TASKS
        ============================== */}

        {activePage === "Tasks" && (
          <section className="projects-section">

            <div className="section-heading">
              <h2>All Tasks</h2>
            </div>

            {tasks.length === 0 ? (
              <p>
                No tasks found. Create your first task.
              </p>
            ) : (
              <div className="project-grid">

                {tasks.map((item) => (
                  <div
                    className="project-card task-card"
                    key={item._id}
                  >

                    <h3>{item.title}</h3>

                    <p>
                      {item.description}
                    </p>

                    <p>
                      <strong>Project:</strong>{" "}
                      {item.projectId?.name ||
                        "Unknown Project"}
                    </p>

                    <p>
                      <strong>Assigned To:</strong>{" "}
                      {item.assignedTo ||
                        "Unassigned"}
                    </p>

                    <p>
                      <strong>Priority:</strong>{" "}
                      {item.priority}
                    </p>

                    <div className="task-status">

                      <label>
                        <strong>Status:</strong>
                      </label>

                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="To Do">
                          To Do
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                      </select>

                    </div>

                    <p>
                      <strong>Due Date:</strong>{" "}
                      {item.dueDate
                        ? new Date(
                            item.dueDate
                          ).toLocaleDateString()
                        : "Not set"}
                    </p>

                    {/* ==============================
                        COMMENTS
                    ============================== */}

                    <div className="comments-section">

                      <h4>Comments</h4>

                      {comments[item._id]?.length > 0 ? (
                        <div className="comments-list">

                          {comments[item._id].map(
                            (comment) => (
                              <div
                                className="comment"
                                key={comment._id}
                              >

                                <strong>
                                  {comment.author}
                                </strong>

                                <p>
                                  {comment.text}
                                </p>

                                <small>
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleString()}
                                </small>

                              </div>
                            )
                          )}

                        </div>
                      ) : (
                        <p className="no-comments">
                          No comments yet.
                        </p>
                      )}

                      <input
                        type="text"
                        placeholder="Your name"
                        value={
                          commentAuthor[item._id] ||
                          ""
                        }
                        onChange={(e) =>
                          handleCommentAuthorChange(
                            item._id,
                            e.target.value
                          )
                        }
                      />

                      <textarea
                        placeholder="Write a comment..."
                        value={
                          commentText[item._id] ||
                          ""
                        }
                        onChange={(e) =>
                          handleCommentTextChange(
                            item._id,
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="create-btn"
                        onClick={() =>
                          handleAddComment(
                            item._id
                          )
                        }
                      >
                        Post Comment
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

        {/* ==============================
            PROFILE
        ============================== */}

        {activePage === "Profile" && (
          <section className="projects-section">

            <h2>Profile</h2>

            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <button
              className="create-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </section>
        )}

        {/* ==============================
            CREATE PROJECT MODAL
        ============================== */}

        {showProjectForm && (
          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h2>Create New Project</h2>

                <button
                  onClick={() =>
                    setShowProjectForm(false)
                  }
                >
                  ×
                </button>

              </div>

              <form onSubmit={handleCreateProject}>

                <label>
                  Project Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={project.name}
                  onChange={
                    handleProjectInputChange
                  }
                  placeholder="Enter project name"
                  required
                />

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={project.description}
                  onChange={
                    handleProjectInputChange
                  }
                  placeholder="Enter project description"
                />

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={project.startDate}
                  onChange={
                    handleProjectInputChange
                  }
                />

                <label>
                  Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={project.deadline}
                  onChange={
                    handleProjectInputChange
                  }
                />

                <button
                  type="submit"
                  className="create-btn"
                >
                  Create Project
                </button>

              </form>

            </div>

          </div>
        )}

        {/* ==============================
            CREATE TASK MODAL
        ============================== */}

        {showTaskForm && (
          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h2>Create New Task</h2>

                <button
                  onClick={() =>
                    setShowTaskForm(false)
                  }
                >
                  ×
                </button>

              </div>

              <form onSubmit={handleCreateTask}>

                <label>
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={
                    handleTaskInputChange
                  }
                  placeholder="Enter task title"
                  required
                />

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={task.description}
                  onChange={
                    handleTaskInputChange
                  }
                  placeholder="Enter task description"
                />

                <label>
                  Project
                </label>

                <select
                  name="projectId"
                  value={task.projectId}
                  onChange={
                    handleTaskInputChange
                  }
                  required
                >

                  <option value="">
                    Select a project
                  </option>

                  {projects.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}

                </select>

                <label>
                  Assigned To
                </label>

                <input
                  type="text"
                  name="assignedTo"
                  value={task.assignedTo}
                  onChange={
                    handleTaskInputChange
                  }
                  placeholder="Enter team member name"
                />

                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={task.priority}
                  onChange={
                    handleTaskInputChange
                  }
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                </select>

                <label>
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={
                    handleTaskInputChange
                  }
                />

                <button
                  type="submit"
                  className="create-btn"
                >
                  Create Task
                </button>

              </form>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default App;

