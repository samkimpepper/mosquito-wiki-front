import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    profileImageUrl: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/auth/me", {
        credentials: "include"
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            setUser(data);
            if (data && data.profileImageUrl) {
                data.profileImageUrl =data.profileImageUrl;
            }
            setLoading(false);
        })
        .catch(() => {
            setUser(null);
            setLoading(false);
        });
    }, []);

    const logout = () => {
        fetch("http://localhost:8080/logout", {
            method: "POST",
            credentials: "include"
        }).then(() => {
            setUser(null);
            window.location.href = "/";
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthProvider 밖에서 사용 불가");
    return context;
}