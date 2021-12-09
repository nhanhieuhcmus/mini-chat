import axios from "../config/axios";

const fetchChatService = (data) => {
    return axios.post("/api/chat", data);
};
const getSingleChatService = (id, config) => {
    return axios.get(`/api/chat/${id}`, config);
};
const getAllChatService = (config) => {
    return axios.get(`/api/chat`, config);
};

export { fetchChatService, getSingleChatService, getAllChatService };
