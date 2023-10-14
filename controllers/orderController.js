const Order = require('../models/orderModel');
const Product = require('../models/productModel');

/**
 * @DESC New Order Controller
 */
exports.newOrder = async (req, res) => {
    try {
        const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
        } = req.body;

        const order = await Order.create({
            shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id,
        });
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        })
    } catch (error) {
        console.error("New Order Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}


/**
 * @DESC Get Single Order Controller
 */
exports.getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this id"
            });
        }
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Get Single Order Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

/**
 * @DESC Check Logged In User Order Controller
 */
exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log("My Order Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Servre Error"
        });
    }
}


/**
 * @DESC Get All Order || {<Admin Access Only>}
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        let totalAmount = 0;
        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });
        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    } catch (error) {
        console.log("Get All Orders Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}


/**
 * @DESC Update Orders || {<Admin Access Only>}
 */
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "You have already delivered this order"
            });
        }
        if (req.body.status === "Shipped") {
            order.orderItems.forEach(async (o) => {
                await updateStock(o.product, o.quantity);
            });
        }
        order.orderStatus = req.body.status;

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }
        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Your order shipped successfully"
        });
    } catch (error) {
        console.log("Update Orders", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

/**
 * @DESC Delete Order || {<Admin Access Only>}
 */
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                messsage: "Order not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        })
    } catch (error) {
        console.log("Delete Orders Controller", error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}