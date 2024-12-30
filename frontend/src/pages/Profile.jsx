import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import { authStore } from '../store/auth.store'
import { useState } from 'react';
import { FaCamera } from "react-icons/fa6";
import { toast } from "react-hot-toast"

const Profile = () => {

    const { updateProfile, isUpdatingProfile } = authStore();

    const { authUser } = authStore();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")

    // fetch user data from backend and update state
    useEffect(() => {
        setName(authUser.data.name)
        setEmail(authUser.data.email)
    }, [authUser])

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === "image") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatar(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    let img = authUser.data.avatar.url !== null ? authUser.data.avatar.url : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    useEffect(() => {
        setAvatar(img);
    }, [authUser])


    const handleUpodate = async () => {
        if (name === authUser.data.name && email === authUser.data.email && authUser.data.avatar.url === avatar) {
            toast.error("No changes made");
            return
        }

        if (avatar === authUser.data.avatar.url) {
            const payload = { name, email };
            updateProfile(payload);
            return
        }
        const payload = { name, email, avatar };
        console.log(payload);

        updateProfile({ name, email, avatar });
    };


    return (
        <>

            {authUser.data && authUser.data ? <>

                {/* Hidden input for image selection */}
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="fileInput"
                    onChange={(e) => handleFileChange(e, "image")}
                />

                <div className="profile_page">
                    <div className="main_profile_page">
                        <div className="profile_img_sec">
                            <img src={avatar} alt="" />
                            <button onClick={() => document.getElementById("fileInput").click()}>
                                <FaCamera />
                            </button>
                        </div>
                        <div className="profile_name_sec">
                            <h2>{
                                authUser.data.name.length > 20 ? authUser.data.name.slice(0, 12) + "..." : authUser.data.name
                            }</h2>
                        </div>
                        <div className="profile_name_input_sec">
                            <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="profile_email_sec">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button onClick={handleUpodate} disabled={isUpdatingProfile} id='update_btn'>
                            {isUpdatingProfile ? "Updating Profile" : "Update"}
                        </button>
                        <br />
                        <Link to={'/'}>go back</Link>
                    </div>
                </div>
            </>
                : ""}
        </>
    )
}

export default Profile