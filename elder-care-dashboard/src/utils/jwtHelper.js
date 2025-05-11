import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    if (!token) {
        console.log('Không tìm thấy token!');
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return {
            _id: decoded._id,
            role: decoded.role,
            avatar: decoded.avatar,
        };
    } catch (error) {
        console.error('Lỗi giải mã token:', error);
        return null;
    }
};
