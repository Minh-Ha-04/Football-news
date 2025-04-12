import axios from 'axios';

const API_URL = 'http://localhost:5000';

const handleResponse = (response) => {
    if (response.data) {
        return response.data;
    }
    throw new Error('Response is not JSON');
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.put(`${API_URL}/auth/profile`, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật thông tin người dùng');
    }
};

export const getSavedPosts = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.get(`${API_URL}/auth/saved-posts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách bài đã lưu');
    }
};

export const getViewedPosts = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.get(`${API_URL}/auth/viewed-posts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách bài đã xem');
    }
}; 