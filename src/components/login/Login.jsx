import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../api/authservice";
import "./login.scss";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/categories");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); 

    try {
      const { message } = await login(username, password);
      toast.success(message);
      navigate("/categories");
    } catch (error) {
      setError(error);
      toast.error(error.message || "Login failed!");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>AutoZoom</h2>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
          minLength={3}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
          minLength={3}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={loading ? "loading" : ""}>
          {loading ? (
            "Logging in..."
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
