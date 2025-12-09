import { useState,useEffect } from "react";
import "../Style/Signup.css";
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
useEffect(()=>{
  axios.get(`${import.meta.env.VITE_API_URL}/users`).then((res)=>{
    console.log(res.data);
  }).catch((err)=>{
    console.log(err);
  })
},[])
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    
    axios.post(`${import.meta.env.VITE_API_URL}/users`,{
    userName:formData.username,
    email:formData.email,
    password:formData.password
    
    }).then((res)=>{
        console.log(res.data);
          alert("Account created!");
    }).catch((err)=>{
        console.log(err);
        alert("Error creating account");
    });
  
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Sign Up</h1>
        <p className="signup-subtext">Join RedditClone today.</p>

        {error && <p className="error-box">{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="signup-btn" type="submit">
            Create Account
          </button>
        </form>

        <p className="signup-bottom">
          Already have an account? 
        </p>
      </div>
    </div>
  );
}
