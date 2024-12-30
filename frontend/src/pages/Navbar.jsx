import React from 'react'
import { CiLogout } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import { RiAccountBox2Line } from "react-icons/ri";
import { FaRocketchat } from "react-icons/fa";
import { Link } from "react-router-dom"
import { authStore } from '../store/auth.store';

const Navbar = () => {

    const { authUser, LogOut } = authStore();

    return (<>
        <div className='info_box'>
            <p>This project is created by <a href="https://github.com/developer-sami">SAMI</a></p>
        </div>
        <div className='navbar'>
            <div className="logo">
                <Link to="/">
                    <div>
                        <FaRocketchat />
                        <h1>Chat App</h1>
                    </div>
                </Link>
            </div>
            {
                authUser && authUser ?
                    <div className="links">
                        <div className='profile'>
                            <div>
                                <Link to={`/profile`}>
                                    {authUser.data.avatar && authUser.data.avatar.url !== null ?
                                        <img src={authUser.data.avatar.url} alt="users" />
                                        :
                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" />
                                    }
                                </Link>
                            </div>
                        </div>
                        <div>
                            <CiLogout />
                            <a onClick={() => LogOut()}>Logout</a>
                        </div>
                    </div>
                    :
                    <div className="links">
                        <div>
                            <CiLogin />
                            <Link to="/">Login</Link>
                        </div>
                        <div>
                            <RiAccountBox2Line />
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
            }


        </div >
    </>
    )
}

export default Navbar