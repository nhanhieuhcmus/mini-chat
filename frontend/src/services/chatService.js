import createAxiosInstance from "../config/axios";

const fetchChatService = (data) => {
    return createAxiosInstance().post("/api/chat", data);
};
const getSingleChatService = (id, config) => {
    return createAxiosInstance().get(`/api/chat/${id}`, config);
};
const getMessageByIdService = (id, authToken) => {
    return createAxiosInstance(authToken).get(`/api/message/${id}`);
};
const sendMessageService = (data, authToken) => {
    return createAxiosInstance(authToken).post(`/api/message`, data);
};
const accessChatService = (data, authToken) => {
    return createAxiosInstance(authToken).post(`/api/chat`, data);
};
const getAllChatService = (config) => {
    return createAxiosInstance().get(`/api/chat`, config);
};

export {
    fetchChatService,
    getSingleChatService,
    getAllChatService,
    getMessageByIdService,
    sendMessageService,
    accessChatService,
};
