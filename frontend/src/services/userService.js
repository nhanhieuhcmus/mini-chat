import createAxiosInstance from "../config/axios";

const loginService = (data) => {
    return createAxiosInstance().post("/api/user/login", data);
};

const signupService = (data) => {
    return createAxiosInstance().post("/api/user", data);
};
const searchUserService = (search, authToken) => {
    return createAxiosInstance(authToken).get(`/api/user?search=${search}`);
};
const createGroupService = (data, authToken) => {
    return createAxiosInstance(authToken).post(`/api/chat/group`, data);
};
const renameGroupService = (data, authToken) => {
    return createAxiosInstance(authToken).put(`/api/chat/rename`, data);
};
const addUserService = (data, authToken) => {
    return createAxiosInstance(authToken).put(`/api/chat/groupadd`, data);
};
const removeUserService = (data, authToken) => {
    return createAxiosInstance(authToken).put(`/api/chat/groupremove`, data);
};

export {
    signupService,
    loginService,
    searchUserService,
    createGroupService,
    renameGroupService,
    addUserService,
    removeUserService,
};
