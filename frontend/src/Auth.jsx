import { useState } from "react";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
const url = isLogin
  ? "https://codealpha-projectflow-backend.onrender.com/api/auth/login"
  : "https://codealpha-projectflow-backend.onrender.com/api/auth/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");
        onLogin(data.user);
      } else {
        alert("Registration successful! Please login.");

        setIsLogin(true);

        setForm({
          name: "",
          email: form.email,
          password: ""
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>ProjectFlow</h1>

        <h2>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p>
          {isLogin
            ? "Login to manage your projects and tasks."
            : "Create your ProjectFlow account."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </>
          )}

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <button
            type="submit"
            className="create-btn"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          className="auth-switch"
          onClick={() => {
            setIsLogin(!isLogin);

            setForm({
              name: "",
              email: "",
              password: ""
            });
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default Auth;

