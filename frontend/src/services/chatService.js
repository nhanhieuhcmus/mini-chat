import axios from "../config/axios";

const fetchChatService = (data) => {
    return axios.post("/api/chat", data);
};

export { fetchChatService };
