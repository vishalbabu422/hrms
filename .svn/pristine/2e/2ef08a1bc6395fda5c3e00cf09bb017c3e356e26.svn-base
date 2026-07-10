import React, { createContext, useState, useEffect } from "react";
import { loginUser, refreshToken, logoutUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (data) => {
        const res = await loginUser(data);
        localStorage.setItem("accessToken", res.accessToken);
        setUser(res.user);
    };

    const logout = async () => {
        await logoutUser();
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    const refresh = async () => {
        try {
            const res = await refreshToken();
            localStorage.setItem("accessToken", res.accessToken);
        } catch (err) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};
