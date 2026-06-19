import API from "../api/axios";

export const loginUser = async (data) => {
    const res = await API.post("/auth/login", data);
    return res.data;
};

export const refreshToken = async () => {
    const res = await API.post("/auth/refresh");
    return res.data;
};

export const logoutUser = async () => {
    const res = await API.post("/auth/logout");
    return res.data;
};
