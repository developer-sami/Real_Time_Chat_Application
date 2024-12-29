import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast';


export const messageStore = create((set) => ({
    allUsers: [],
    chat_messages: null,
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
            set({ messages: res.data }); 
            set({isClicked: true});           
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
            set({ isClicked: true });
        }
    },

}));