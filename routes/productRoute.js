const express = require('express')
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getPorductDetails, createProductReview, getProductReview, deleteProductReview } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authentication');

router.route('/products').get(getAllProducts);

router.route('/product/detail/:id').get(getPorductDetails);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route('/admin/product/update/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router.route('/admin/product/delete/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route('/review').post(isAuthenticatedUser, createProductReview);

router.route('/all/reviews').get(getProductReview);

router.route('/review/delete').delete(isAuthenticatedUser, deleteProductReview);

module.exports = router;