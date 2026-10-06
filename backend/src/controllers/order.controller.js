import CartModel from "../model/cart.model.js";
import OrderModel from "../model/order.model.js";
import crypto from "crypto";
import { sendBadRequest, sendNotFound, sendServerError, } from "../utils/response.js";
import Razorpay from "razorpay"
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_Key,
    key_secret: process.env.RAZORPAY_Key_Secret,
});

const place = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingAddress, paymentMethod } = req.body;

        console.log("paymentMethod received:", paymentMethod);

        if (!shippingAddress || !paymentMethod) {
            return sendBadRequest(
                res,
                "Shipping address and payment method required"
            );
        }

        const cart = await CartModel
            .findOne({ userId })
            .populate({
                path: "items.productId",
                select: "name salePrice originalPrice discount thumbnail",
            });

        if (!cart) {
            return sendNotFound(res, "Cart not found");
        }

        if (!cart.items || cart.items.length === 0) {
            return sendBadRequest(res, "Cart is empty");
        }

        const items = cart.items.map((item) => {
            const product = item.productId;

            if (!product) {
                throw new Error("Product not found in cart");
            }

            const price = Number(
                product.salePrice ?? product.originalPrice
            );

            if (!price || price <= 0) {
                throw new Error(
                    `Invalid product price for ${product._id}`
                );
            }

            return {
                product_id: product._id,
                qty: item.qty,
                price: price,
                total: price * item.qty,
            };
        });

        const totalAmount = items.reduce(
            (sum, item) => sum + item.total,
            0
        );

        console.log("Order Total:", totalAmount);
        console.log("Razorpay Amount:", totalAmount * 100);

        const order = await OrderModel.create({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "placed",
        });

        if (paymentMethod === "cod") {
            await CartModel.findOneAndDelete({ userId });

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                orderId: order._id,
            });
        }

        if (paymentMethod === "online") {
            const options = {
                amount: totalAmount * 100,
                currency: "INR",
                receipt: order._id.toString(),
            };

            instance.orders.create(
                options,
                async function (err, razorpay_order) {
                    if (err) {
                        console.error(
                            "Razorpay Order Error:",
                            err
                        );

                        return sendServerError(
                            res,
                            "Razorpay order creation failed"
                        );
                    }

                    order.razorpay_order_id =
                        razorpay_order.id;

                    await order.save();

                    return res.status(200).json({
                        success: true,
                        message: "Order created",
                        orderId: order._id,
                        razorpay_order_id:
                            razorpay_order.id,
                        total: totalAmount,
                        razorpay_amount:
                            razorpay_order.amount,
                    });
                }
            );

            return;
        }

        return sendBadRequest(
            res,
            "Invalid payment method"
        );

    } catch (error) {
        console.error("Place Order Error:", error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};



const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const order = await OrderModel.findOne({
            razorpay_order_id: razorpay_order_id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_Key_Secret
            )
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {

            console.log("PAYMENT SIGNATURE VERIFIED");

            order.razorpay_payment_id = razorpay_payment_id;
            order.paymentStatus = "paid";

            await order.save();

            await CartModel.findOneAndDelete({
                userId: req.user._id,
            });

            return res.status(200).json({
                success: true,
                message: "Payment Verified Successfully"
            });
        }

        console.log("PAYMENT SIGNATURE INVALID");

        return res.status(400).json({
            success: false,
            message: "Invalid Signature"
        });

    } catch (error) {
        console.error("Verify Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const myOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await OrderModel
            .find({ user: userId })
            .populate({
                path: "items.product_id",
                select: "name thumbnail salePrice originalPrice",
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });

    } catch (error) {
        console.error("My Orders Error:", error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};



const getOrderById = async (req, res) => {
    try {

        const { orderId } = req.params;
        const userId = req.user._id;


        const order = await OrderModel
            .findOne({
                _id: orderId,
                user: userId,
            })
            .populate({
                path: "items.product_id",
                select: "name thumbnail salePrice originalPrice",
            });


        if (!order) {
            return sendNotFound(
                res,
                "Order not found"
            );
        }


        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order,
        });


    } catch (error) {

        console.error(
            "Get Order By ID Error:",
            error
        );

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};


const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        // Find only the logged-in user's order
        const order = await OrderModel.findOne({
            _id: orderId,
            user: userId,
        });

        if (!order) {
            return sendNotFound(
                res,
                "Order not found"
            );
        }

        // Only these statuses can be cancelled
        if (
            order.orderStatus !== "placed" &&
            order.orderStatus !== "confirmed"
        ) {
            return sendBadRequest(
                res,
                `Order cannot be cancelled because it is already ${order.orderStatus}`
            );
        }

        // Update order status
        order.orderStatus = "cancelled";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });

    } catch (error) {
        console.error(
            "Cancel Order Error:",
            error
        );

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};



export {
    place,
    verifyPayment,
    myOrders,
    getOrderById,
    cancelOrder
};