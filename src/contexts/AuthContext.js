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
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });
    const [loading, setLoading] = useState(true);

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return { success: false, data: null };
            }

            const response = await getCurrentUser();
            if (response.success) {
                const userData = response.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                setIsAuthenticated(true);
                return { success: true, data: userData };
            } else {
                handleLogout();
                return { success: false, data: null };
            }
        } catch (error) {
            console.error('Load user data error:', error);
            handleLogout();
            return { success: false, data: null };
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await loadUserData();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
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
                const { token, user: loginUser } = response.data;
                
                localStorage.setItem('token', token);
                
                const { success, data } = await loadUserData();
                
                if (!success) {
                    return { 
                        success: false, 
                        message: 'Không thể tải thông tin người dùng' 
                    };
                }

                if (data.role === 'admin') {
                    window.location.replace('http://localhost:3000/admin');
                }

                return { success: true, message: 'Đăng nhập thành công' };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        if (updatedUser) {
            const newUserData = { ...user, ...updatedUser };
            setUser(newUserData);
            localStorage.setItem('user', JSON.stringify(newUserData));
            
            await loadUserData();
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
        refreshUser: loadUserData
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 