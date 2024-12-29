import React, { useState } from 'react';
import { MdOutlineMail } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { LuMoveRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast"
import { authStore } from '../store/auth.store';

const Register = () => {

    const {isSignInUp,signUp} = authStore();

    // State to store form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value, // Update the field dynamically based on its id
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }

        // password validation
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        // send the form data to the server
        signUp(formData);
    };

    return (
        <div className='login'>
            <div className='main_login'>
                <div className="left">
                    <div className="login_from">
                        <h2 id='register'>Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name"><FaPen /> Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder='example name'
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email"><MdOutlineMail /> Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder='vJv5e@example.com'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password"><MdOutlinePassword /> Password</label>
                                <input
                                    type="text"
                                    id="password"
                                    placeholder='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button disabled={isSignInUp} type="submit">Register <CiLogin /></button>
                        </form>
                        <div className="register_link">
                            <p>Have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <h1>Welcome <br />User!</h1>
                    <br />
                    <p>Create an account and start chatting with your friends.</p>
                    <br />
                    <LuMoveRight />
                </div>
            </div>
        </div>
    );
};

export default Register;
