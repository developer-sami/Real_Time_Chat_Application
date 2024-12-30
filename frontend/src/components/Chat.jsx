import React, { useEffect, useRef, useState } from 'react'
import { FaImages } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { toast } from "react-hot-toast"
import { messageStore } from '../store/message.store';
import { authStore } from '../store/auth.store';
import { FaRocketchat } from "react-icons/fa";

const Chat = () => {

    const { selectedUser, messages, sendMessage } = messageStore();
    const { authUser } = authStore()

    const [message, setMessage] = useState("");
    const [base64Image, setBase64Image] = useState(null);
    const [base64PDF, setBase64PDF] = useState(null);

    // Function to scroll to the bottom of the chat box 
    const chatBoxRef = useRef(null);
    const scrollToBottom = () => {
        const chatBox = chatBoxRef.current;
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to handle file selection
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === "image") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBase64Image(reader.result);
                };
                reader.readAsDataURL(file);
                toast.success("Image selected successfully");
            } else if (type === "pdf") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBase64PDF(reader.result);
                };
                reader.readAsDataURL(file);
                toast.success("PDF selected successfully");
            }
        }
    };

    const handleUpload = () => {
        if (!message && !base64Image && !base64PDF) {
            toast.error("Please enter a message or select an image or PDF file");
            return;
        }
        const payload = {
            text: message,
            image: base64Image,
            pdf: base64PDF,
        };
        sendMessage(selectedUser, payload);

        setMessage("");
        setBase64Image(null);
        setBase64PDF(null);

    };

    // Function to handle keyboard press (enter key)
    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            handleUpload();
        }
    }

    return (
        <>

            {/* Hidden input for image and pdf selection */}
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="fileInput"
                onChange={(e) => handleFileChange(e, "image")}
            />

            <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                id="pdfInput"
                onChange={(e) => handleFileChange(e, "pdf")}
            />

            {selectedUser ?
                <>
                    <div className="chat_container">
                        <div className="text_box" ref={chatBoxRef}>
                            {messages && messages.length === 0 ?
                                <div>
                                    <h3 style={{ textAlign: "center", marginTop: "20px", color: "#464646" }}>No conversation!</h3>
                                </div>
                                : ""}
                            {messages && messages.map((message, index) => (
                                <>
                                    <div key={index}>
                                        {/* sender_text */}
                                        {/* className="data_container" */}
                                        <div className={message.senderId === authUser.data._id ? "data_container sender_text" : "data_container"} >
                                            <div className="right">
                                                {message.image.url !== null ?
                                                    <div className="for_img">
                                                        <img src={message.image.url} />
                                                    </div>
                                                    : ""
                                                }

                                                <div className='for_pdf'>
                                                    {message.pdf.url !== null ?
                                                        <a download={message.pdf.url} href={message.pdf.url}>
                                                            <button>
                                                                <FaFilePdf />
                                                                Download PDF
                                                            </button>
                                                        </a> : ""
                                                    }
                                                </div>
                                                <div className="message">
                                                    <p>{message.text}</p>
                                                    <br />
                                                    <p style={{ fontSize: "10px" }}>{new Date(message.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            message.senderId !== authUser.data._id ?
                                                <div className="sender_img" >
                                                    <img src={
                                                        selectedUser && selectedUser[1] !== "" ? selectedUser[1] : "https://th.bing.com/th/id/OIP.R_vqbG0cTkojcoRt-UwrUgHaHa?w=192&h=192&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                                                    } />
                                                </div> : ""
                                        }
                                    </div>

                                    {
                                        messages.messages && messages.messages.length == 0 ? <div className="no_msg">
                                            <p style={{ textAlign: "center", marginTop: "20px", color: "#2F1793" }}>No messages found!</p>
                                        </div> : ""
                                    }
                                </>
                            ))}




                        </div>
                        <div className="send_items">
                            <div>
                                <button onClick={() => document.getElementById("fileInput").click()}><FaImages /></button>
                            </div>
                            <div>
                                <button onClick={() => document.getElementById("pdfInput").click()}><FaFilePdf /></button>
                            </div>
                            <input onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)} value={message} type="text" placeholder="Type a message..." />
                            <button className='send_btn' onClick={handleUpload}>Send</button>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className='default_chat_box'> 
                            <FaRocketchat />
                            <h3>Welcome to <strong>ChatApp!</strong></h3>
                            <p>Please select a user from the sidebar</p>
                    </div>
                </>
            }
        </>
    )
}

export default Chat
