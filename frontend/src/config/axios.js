import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: false,
});

export default instance;
