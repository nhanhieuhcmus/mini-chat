import axios from "axios";

const config = {
    baseURL: process.env.REACT_APP_REQUEST_BASE_URL || "http://localhost:5000",
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: false,
};

const instance = axios.create(config);

export default instance;
