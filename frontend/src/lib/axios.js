import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: import.meta.env.MODE === "development" ? "http://localhost:4000/api/v1" : "/api/v1",
    baseURL: "http://localhost:4000/api/v1",
    withCredentials: true, // send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});