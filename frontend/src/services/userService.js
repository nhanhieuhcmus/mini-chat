import axios from "../config/axios";

const loginService = (data) => {
    return axios.post("/api/user/login", data);
};

const signupService = (data) => {
    return axios.post("/api/user", data);
};

export { signupService, loginService };
