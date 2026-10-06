import CartModel from "../model/cart.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"

const syncCart = async (req, res) => {
    try {

        const userId = req.user._id;

        const localCart = req.body.localCart
            ? JSON.parse(req.body.localCart)
            : [];


        let userCart = await CartModel.findOne({ userId })
            .populate({
                path: "items.productId",
                select: "name _id salePrice originalPrice discount thumbnail",
            });


        // =====================================
        // LOCAL CART EMPTY
        // =====================================

        if (localCart.length === 0) {

            return res.status(200).json({
                success: true,
                message: "Fetched cart from server",
                cart: userCart ? userCart.items : [],
            });

        }


        // =====================================
        // CREATE CART IF NOT EXISTS
        // =====================================

        if (!userCart) {

            userCart = new CartModel({
                userId,
                items: [],
            });

        }


        // =====================================
        // REMOVE INVALID PRODUCTS
        // =====================================

        userCart.items = userCart.items.filter(
            (item) => item.productId !== null
        );


        // =====================================
        // MERGE LOCAL CART
        // =====================================

        localCart.forEach((cartItem) => {

            const { id, qty } = cartItem;


            const existingItem = userCart.items.find(
                (item) => {

                    if (!item.productId) {
                        return false;
                    }

                    const productId =
                        item.productId._id
                            ? item.productId._id.toString()
                            : item.productId.toString();

                    return productId === id.toString();

                }
            );


            if (existingItem) {

                existingItem.qty = qty;

            } else {

                userCart.items.push({
                    productId: id,
                    qty: qty || 1,
                });

            }

        });


        await userCart.save();


        // =====================================
        // POPULATE UPDATED CART
        // =====================================

        userCart = await CartModel.findOne({ userId })
            .populate({
                path: "items.productId",
                select: "name _id salePrice originalPrice discount thumbnail",
            });


        // =====================================
        // REMOVE NULL PRODUCTS AGAIN
        // =====================================

        userCart.items = userCart.items.filter(
            (item) => item.productId !== null
        );


        console.log("Synced Cart:", userCart.items);


        return res.status(200).json({

            success: true,

            message: "Cart synced successfully",

            cart: userCart,

        });


    } catch (error) {

        console.log("Sync Cart Error:", error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, qty = 1 } = req.body;

        if (!productId) {
            return sendBadRequest(res, "Product ID is required");
        }

        let cart = await CartModel.findOne({ userId });

        // User ka cart nahi hai → naya cart create karo
        if (!cart) {
            cart = await CartModel.create({
                userId,
                items: [
                    {
                        productId,
                        qty: Number(qty) || 1,
                    },
                ],
            });

            return res.status(201).json({
                success: true,
                message: "Product added to cart",
                cart,
            });
        }

        // Product already cart me hai
        const existingItem = cart.items.find(
            (item) =>
                item.productId.toString() === productId.toString()
        );

        if (existingItem) {
            existingItem.qty += Number(qty) || 1;
        } else {
            cart.items.push({
                productId,
                qty: Number(qty) || 1,
            });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });

    } catch (error) {
        console.error("Add To Cart Error:", error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};



const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      message: "Product removed successfully",
      cart
    });

  } catch (error) {
    console.log(error);
    sendServerError(res, "Internal Server Error");
  }
};


const qty = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, action } = req.body;

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (action === "increase") {
      item.qty += 1;
    }

    if (action === "decrease") {
      item.qty -= 1
    }

    if (item.qty <= 0) {
      cart.items = cart.items.filter(
        i =>
          i.productId.toString() != productId
      );
    }

    await cart.save();

    res.status(200).json({
      message: "Quantity updated",
      cart
    });

  } catch (error) {
    console.log(error);
    sendServerError(res, "Internal Server Error");
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (error) {
    console.log("Clear Cart Error:", error);

    return sendServerError(res, "Internal Server Error");
  }
};


export {
  syncCart,
  addToCart,
  removeFromCart,
  qty,
  clearCart
}