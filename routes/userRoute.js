const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUsers, getSingleUser, updateUser, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authentication');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/password/forgot', forgotPassword);

router.put('/password/reset/:token', resetPassword);

router.get('/myaccount', isAuthenticatedUser, getUserDetails);

router.put('/password/update', isAuthenticatedUser, updateUserPassword);

router.put('/myaccount/update', isAuthenticatedUser, updateUserProfile);

router.get('/admin/users', isAuthenticatedUser,  authorizeRoles("Admin"), getAllUsers);

router.get('/admin/user/:id', isAuthenticatedUser,  authorizeRoles("Admin"), getSingleUser);

router.put('/admin/account/update/:id', isAuthenticatedUser,  authorizeRoles("Admin"), updateUser);

router.delete('/admin/user/delete/:id', isAuthenticatedUser,  authorizeRoles("Admin"), deleteUser);


module.exports = router;