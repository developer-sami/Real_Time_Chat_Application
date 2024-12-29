import React, { useEffect, useRef, useState } from 'react'
import { FaImages } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { toast } from "react-hot-toast"
import { messageStore } from '../store/message.store';
import { authStore } from '../store/auth.store';
import { FaRocketchat } from "react-icons/fa";
const Chat = () => {

    const { messages, isMessagesLoading, isClicked } = messageStore();
    const { authUser } = authStore();

    const [message, setMessage] = useState("");
    const [base64Image, setBase64Image] = useState("");
    const [base64PDF, setBase64PDF] = useState("");

    // Function to convert file to Base64
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (type === "image") {
                    setBase64Image(reader.result); // Store Base64 image data in state
                } else if (type === "pdf") {
                    setBase64PDF(reader.result); // Store Base64 PDF data in state
                }
            };
            reader.readAsDataURL(file); // Convert the file to Base64
        }
    };

    // Function to handle image upload
    const handleUpload = () => {
        if (message == "") {
            toast.error("Please enter a message first or select a file.");
            return;
        }
    };

    // Function to handle keyboard press (enter key)
    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            handleUpload();
        }
    }

    // Function to scroll to the bottom of the chat box  const chatBoxRef = useRef(null);

    // Function to scroll to the bottom
    const chatBoxRef = useRef(null);
    const scrollToBottom = () => {
        const chatBox = chatBoxRef.current;
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    // Scroll to the bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <>

            {/* Hidden input for file selection */}
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="fileInput"
                onChange={(e) => handleFileChange(e, "image")}
            />

            {/* Hidden input for PDF selection */}
            <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                id="pdfInput"
                onChange={(e) => handleFileChange(e, "pdf")}
            />

            {isClicked ? <>
                {isMessagesLoading ? <div className="loader"></div > :

                    <div className="chat_container">
                        <div className="text_box" ref={chatBoxRef}>
                            {messages.messages && messages.messages.map(message => (
                                <div>
                                    <div className="data_container sender_text" >
                                        <div className="right">
                                            {message.image.url !== null ?
                                                <div className="for_img">
                                                    <img src={message.image.url} />
                                                </div> : ""}
                                            {message.pdf.url !== null ?
                                                <div className='for_pdf'>
                                                    <a download={message.pdf.url} href={message.pdf.url}>
                                                        <button>
                                                            <FaFilePdf />
                                                            Download PDF
                                                        </button>
                                                    </a>
                                                </div> : ""}
                                            <div className="message">
                                                <p>{message.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        authUser.data._id == message.senderId ? "" :
                                            <div className="sender_img" >
                                                <img src="https://th.bing.com/th/id/OIP.c17XAqg6srb_lo1ElbyJSgHaEK?w=310&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" />
                                            </div>
                                    }
                                </div>
                            ))}

                            {
                                messages.messages && messages.messages.length == 0 ? <div className="no_msg">
                                    <p style={{ textAlign: "center", marginTop: "20px" }}>No messages</p>
                                </div> : ""
                            }

                        </div>
                        <div className="send_items">
                            <div>
                                <button onClick={() => document.getElementById("fileInput").click()}><FaImages /></button>
                            </div>
                            <div>
                                <button onClick={() => document.getElementById("pdfInput").click()}><FaFilePdf /></button>
                            </div>
                            <input onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type a message..." />
                            <button className='send_btn' onClick={handleUpload}>Send</button>
                        </div>
                    </div>
                }

            </> : <div className="select_user">
                <div>
                    <h1><FaRocketchat/></h1>
                </div>
                <h1>Please select a user</h1>
            </div>}

        </>
    )
}

export default Chat