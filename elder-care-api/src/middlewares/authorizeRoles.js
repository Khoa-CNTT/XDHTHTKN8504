const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
        }
        next();
    };
};

export default authorizeRoles;