import mongoose from "mongoose";

import UserModel from "../model/user.model.js";
import ProductModel from "../model/product.model.js";

import {
    sendBadRequest,
    sendNotFound,
    sendServerError,
} from "../utils/response.js";


// =====================================
// ADD TO WISHLIST
// =====================================

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Check product ID
        if (!productId) {
            return sendBadRequest(
                res,
                "Product ID is required"
            );
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return sendBadRequest(
                res,
                "Invalid Product ID"
            );
        }

        // Check product
        const product = await ProductModel.findById(productId);

        if (!product) {
            return sendNotFound(
                res,
                "Product not found"
            );
        }

        // Check user
        const user = await UserModel.findById(userId);

        if (!user) {
            return sendNotFound(
                res,
                "User not found"
            );
        }

        // Check already exists
        const alreadyExists = user.wishlist.some(
            (id) => id.toString() === productId.toString()
        );

        if (alreadyExists) {
            return res.status(200).json({
                success: true,
                message: "Product already in wishlist",
                isWishlisted: true,
            });
        }

        // Add product
        user.wishlist.push(productId);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            isWishlisted: true,
        });

    } catch (error) {
        console.log(
            "Add Wishlist Error:",
            error
        );

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};


// =====================================
// REMOVE FROM WISHLIST
// =====================================

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Check product ID
        if (!productId) {
            return sendBadRequest(
                res,
                "Product ID is required"
            );
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return sendBadRequest(
                res,
                "Invalid Product ID"
            );
        }

        // Check user
        const user = await UserModel.findById(userId);

        if (!user) {
            return sendNotFound(
                res,
                "User not found"
            );
        }

        // Remove product
        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId.toString()
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            isWishlisted: false,
        });

    } catch (error) {
        console.log(
            "Remove Wishlist Error:",
            error
        );

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};


// =====================================
// GET WISHLIST
// =====================================

const getWishlist = async (req, res) => {
    try {
        // IMPORTANT:
        // protect middleware req.user set kar raha hai
        const userId = req.user._id;

        const user = await UserModel
            .findById(userId)
            .populate({
                path: "wishlist",

                // ProductCard ko required fields
                // return kar rahe hain
                select: `
                    _id
                    name
                    salePrice
                    originalPrice
                    discount
                    thumbnail
                    slug
                    stock
                    bestSeller
                    categoryId
                `,

                // Category ka name bhi populate
                populate: {
                    path: "categoryId",
                    select: "name",
                },
            });

        // User not found
        if (!user) {
            return sendNotFound(
                res,
                "User not found"
            );
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: user.wishlist || [],
        });

    } catch (error) {
        console.log(
            "Get Wishlist Error:",
            error
        );

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};


// =====================================
// CHECK WISHLIST
// =====================================

const checkWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Check product ID
        if (!productId) {
            return sendBadRequest(
                res,
                "Product ID is required"
            );
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return sendBadRequest(
                res,
                "Invalid Product ID"
            );
        }

        // Get user wishlist
        const user = await UserModel
            .findById(userId)
            .select("wishlist");

        if (!user) {
            return sendNotFound(
                res,
                "User not found"
            );
        }

        // Check product
        const isWishlisted = user.wishlist.some(
            (id) => id.toString() === productId.toString()
        );

        return res.status(200).json({
            success: true,
            isWishlisted,
        });

    } catch (error) {
        console.log(
            "Check Wishlist Error:",
            error
        );

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};


// =====================================
// EXPORTS
// =====================================

export {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkWishlist,
};