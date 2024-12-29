import React, { useEffect, useState } from 'react'
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { messageStore } from '../store/message.store';

const Sidebar = () => {

    const { getAllUsers, allUsers, getMessages } = messageStore();
    const [showUsers, setShowUsers] = useState(false);

    useEffect(() => {
        getAllUsers();
    }, [])

    const getChats = (id) => {
        getMessages(id);
    }


    return (
        <>
            <div className={showUsers ? "sidebar_btn right_btn" : "sidebar_btn"}>
                <button onClick={() => setShowUsers(!showUsers)}>
                    {
                        showUsers ? <FaChevronLeft /> : <FaChevronRight />
                    }
                </button>
            </div>
            <div className="sidebar_container">
                <div className={showUsers ? "sidebar sidebar_show" : "sidebar  hide"}>
                    {allUsers.data && allUsers.data.map(user => (
                        <a key={user._id} onClick={() => getChats(user._id)}>
                            <div className="user" >
                                <div className="img">
                                    {
                                        user.avatar.url ?
                                            <img src={user.avatar.url} alt={user.name} /> :
                                            <img src="https://th.bing.com/th/id/OIP.R_vqbG0cTkojcoRt-UwrUgHaHa?w=192&h=192&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt={user.name} />
                                    }
                                </div>
                                <div>
                                    <h3>
                                        {
                                            user.name.length > 20 ? user.name.slice(0, 20) + "..." : user.name
                                        }
                                    </h3>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Sidebar