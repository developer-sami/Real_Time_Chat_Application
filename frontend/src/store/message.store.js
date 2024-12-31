import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast';
import { authStore } from './auth.store';


export const messageStore = create((set, get) => ({
    allUsers: [],
    messages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isClicked: false,

    getAllUsers: async () => {
        try {
            const res = await axiosInstance.get('/message/users');
            set({ allUsers: res.data });
        } catch (error) {
            toast.error(error.response.data.error);
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data.messages });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    selectTheUser: async (id, image, name) => {
        try {
            set({ selectedUser: [id, image, name] });
        } catch (error) {
            toast.error("network issue!");
            console.log(error);

        }
    },
    sendMessage: async (selectedUser, messageData) => {
        const { messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser[0]}`, messageData);
            set({ messages: [...messages, res.data.data] });

        } catch (error) {
            toast.error("Error sending message");
            console.log(error);
        }
    },

    subscribeToMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = authStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            set({ messages: [...get().messages, newMessage] });
        })
        

    },

    unSubscribeFromMessage: () => {
        const socket = authStore.getState().socket;
        socket.off("newMessage");
    },

}));