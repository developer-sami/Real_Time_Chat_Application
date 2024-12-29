import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast';

export const authStore = create((set) => ({
    authUser: null,
    isSignInUp: false,
    isLoading: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isLoading: false,
    allUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/profile');
            set({ authUser: res.data });
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
        } catch (error) {
            toast.error(error.response.data.error);
        } finally {
            set({ isSignInUp: false });
        }
    },

    login: async (data) => {
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success('Logged in successfully');
        } catch (error) {
            toast.error(error.response.data.error);

        }
    },

    LogOut: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error(error.response.data.error);
        }
    },



}))