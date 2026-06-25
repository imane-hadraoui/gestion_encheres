import { createContext, useContext, useEffect, useState } from "react";
import api, { getCsrfCookie } from "../api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Vérifie s'il existe déjà une session active au chargement
    const recupererUtilisateur = async () => {
        try {
            const { data } = await api.get("/user");
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        recupererUtilisateur();
    }, []);

    const login = async (identifiants) => {
        await getCsrfCookie();
        const { data } = await api.post("/login", identifiants);
        setUser(data.user ?? data);
        return data;
    };

    const register = async (donnees) => {
        await getCsrfCookie();
        const { data } = await api.post("/register", donnees);
        setUser(data.user ?? data);
        return data;
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
