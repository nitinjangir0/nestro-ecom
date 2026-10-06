import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    items: [
      {
        _id: false,

        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products", 
          required: true,
        },

        qty: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;