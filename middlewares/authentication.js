const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({
                sucess: false,
                message: "Please Login to access this resource"
            });
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (error) {
        error.message === "jwt expired" ? res.status(401).json({
            success: false,
            errorMessage: "Session expired please login again."
        }) : res.status(500).json({
            success: false,
            errorMessage: "Something went wrong. Please try again later"
        });
    }
};


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `${req.user.role} is not allowed to access this resouce `
            });
        }
        next();
    };
};