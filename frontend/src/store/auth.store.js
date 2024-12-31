import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast';
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:4000' : "/";
export const authStore = create((set, get) => ({
    authUser: null,
    isSignInUp: false,
    isLoading: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isLoading: false,
    allUsers: [],
    socket: null,
    onLineUser: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/profile');
            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {

        } finally {
            set({ isCheckingAuth: false });
        }
    },


    signUp: async (data) => {
        set({ isSignInUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            toast.success('Account created successfully');

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error);
            
        } finally {
            set({ isSignInUp: false });
        }
    },

    login: async (data) => {
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success('Logged in successfully');

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.error);
        }
    },

    LogOut: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logged out successfully');

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.error);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update', data);
            set({ authUser: res.data });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response.data.error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: async () => {
        const { authUser } = get();
        if (!authUser.data || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser.data._id
            }
        });
        socket.connect();
        set({ socket });

        socket.on('get_online_users', (userIds) => {
            set({ onLineUser: userIds });
        });
    },

    disconnectSocket: async () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },
}))