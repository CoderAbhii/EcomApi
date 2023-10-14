const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const errorHandler = require('../utils/errorHandler');

/**
 * @DESC Create A Product Controller || <{Admin Access Route}>
 */
exports.createProduct = async (req, res, next) => {
    try {
        req.body.user = req.user.id
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        errorHandler("Error Detect In Create-Product Controller \n", error, res);
    }
}

/**
 * @DESC Get All Product Controller
 */
exports.getAllProducts = async (req, res) => {
    try {
        const resultPerPage = 5;
        const productsCount = await Product.countDocuments();

        const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
        const products = await apiFeatures.query;
        const productLength = products.length
        productLength == 0 ? res.status(404).json({
            success: false,
            message: "Product not found"
        }) :
        res.status(200).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount: products.length
        });
    } catch (error) {
        console.error("Get-All-Products Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

/**
 * @DESC Get All Product Controller
 */
exports.getPorductDetails = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        console.error("Get-Product-Details Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

/**
 * @DESC Update Product Controller || <{Admin Access Route}>
 */
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update-Product Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

/**
 * @DESC Delete Product Controller || <{Admin Access Route}>
 */
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete-Product Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}


/**
 * @DESC Create A Product Review Controller 
 */
exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const reviewObject = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }
        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString())
        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });
        }
        else {
            product.reviews.push(reviewObject);
            product.numOfReviews = product.reviews.length
        }
        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;
        await product.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            message: "Thanks for review this product"
        });
    } catch (error) {
        console.error("Create Review Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}


/**
 * @DESC Get All Product Review Controller 
 */
exports.getProductReview = async (req, res) => {
    try {
        const product = await Product.findById(req.query.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            reviews: product.reviews,
            totalReviews: product.reviews.length
        });
    } catch (error) {
        console.error("Get All Review Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}


/**
 * @DESC Delete Product Review Controller 
 */
exports.deleteProductReview = async (req, res) => {
    try {
        const product = await Product.findById(req.query.productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        const ratings = avg / reviews.length;
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews, ratings, numOfReviews
        }, {new: true, runValidators: true, useFindAndModify: false});

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Delete Review Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}