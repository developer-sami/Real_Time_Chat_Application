import React from 'react'
import { MdOutlineMail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { LuMoveRight } from "react-icons/lu";
import { Link } from "react-router-dom"
import { useState } from 'react';
import { toast } from "react-hot-toast"
import { authStore } from '../store/auth.store';

const Login = () => {

  const { login, isLoading } = authStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const SubmitEvent = () => {
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regex.test(formData.email)) {
      toast.error("Invalid email");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    login(formData);

  }

  return (
    <div className='login'>
      <div className='main_login'>
        <div className="left">
          <div className="login_from">
            <h2>Login</h2>
            <br />
            <div>
              <label htmlFor="email"><MdOutlineMail /> Email</label>
              <input onChange={handleChange} type="email" id="email" placeholder='vJv5e@example.com' />
            </div>
            <div>
              <label htmlFor="password"><MdOutlinePassword /> Password</label>
              <input onChange={handleChange} type="text" id="password" placeholder='password' />
            </div>
            <button onClick={() => SubmitEvent()} disabled={isLoading}>{isLoading ? "Loading..." : "Login"} <CiLogin /></button>
            <br />
            <div className="register_link">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
        <div className="right">
          <h1>Welcome <br />Back!</h1>
          <br />
          <p>Login to your account and start chatting with your friends.</p>
          <br />
          <LuMoveRight />
        </div>
      </div>
    </div>
  )
}

export default Login