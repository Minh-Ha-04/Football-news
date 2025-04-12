import { createContext, useContext, useState, useEffect } from 'react';
import { register, login, logout, getCurrentUser } from '~/services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleRegister = async (userData) => {
        try {
            const response = await register(userData);
            if (response.success) {
                return { success: true, message: 'Đăng ký thành công' };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            if (response.success) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                setIsAuthenticated(true);
                return { success: true, message: 'Đăng nhập thành công' };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const handleUpdateUser = (updatedUser) => {
        if (updatedUser) {
            setUser(prevUser => ({
                ...prevUser,
                ...updatedUser
            }));
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUser = {
                ...currentUser,
                ...updatedUser
            };
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        updateUser: handleUpdateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 