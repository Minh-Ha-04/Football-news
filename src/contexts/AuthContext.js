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
                return false;
            }

            const response = await getCurrentUser();
            if (response.success) {
                const userData = response.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                setIsAuthenticated(true);
                return true;
            } else {
                handleLogout();
                return false;
            }
        } catch (error) {
            console.error('Load user data error:', error);
            handleLogout();
            return false;
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
                
                // Lưu token trước
                localStorage.setItem('token', token);
                
                // Tải dữ liệu user đầy đủ
                const loadSuccess = await loadUserData();
                
                if (!loadSuccess) {
                    return { 
                        success: false, 
                        message: 'Không thể tải thông tin người dùng' 
                    };
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
            // Luôn xóa dữ liệu local và reset state
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
            
            // Tải lại dữ liệu user từ server để đảm bảo đồng bộ
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
        refreshUser: loadUserData // Thêm hàm này để components có thể yêu cầu tải lại dữ liệu user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 