import mongoose from "mongoose";

const { Schema } = mongoose;

// ORDER PRODUCT DETAILS
const productDetailsSchema = new Schema(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },

        qty: {
            type: Number,
            required: true,
            min: 1,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

// ORDER SCHEMA
const orderSchema = new Schema(
    {
        // USER
         user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },


        // ORDER ITEMS

        items: {
            type: [productDetailsSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return items.length > 0;
                },
                message: "Order must contain at least one product",
            },
        },


        // SHIPPING ADDRESS

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
                trim: true,
            },

            mobile: {
                type: String,
                required: true,
                trim: true,
            },

            pincode: {
                type: String,
                required: true,
                trim: true,
            },

            addressLine: {
                type: String,
                required: true,
                trim: true,
            },

            city: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                required: true,
                trim: true,
            },

            country: {
                type: String,
                default: "India",
                trim: true,
            },
        },


        // PAYMENT METHOD

        paymentMethod: {
            type: String,
            enum: ["cod", "online"],
            required: true,
        },


        // PAYMENT STATUS

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },


        // ORDER STATUS

        orderStatus: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
                "return",
            ],
            default: "placed",
        },


        // TOTAL AMOUNT

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },


        // RAZORPAY DETAILS

        razorpay_payment_id: {
            type: String,
            default: null,
        },

        razorpay_order_id: {
            type: String,
            default: null,
        },


        // PAYMENT / DELIVERY DATES

        paidAt: {
            type: Date,
            default: null,
        },

        deliveredAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// ORDER MODEL
const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;