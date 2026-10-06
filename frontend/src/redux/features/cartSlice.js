import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    original_total: 0,
    final_total: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        addToCart: (state, { payload }) => {

            const existingItem = state.items.find(
                (item) => item.id === payload.id
            );

            if (existingItem) {
                existingItem.qty += 1;
            } else {
                state.items.push(payload);
            }

            state.original_total += Number(payload.originalPrice);
            state.final_total += Number(payload.salePrice);

            localStorage.setItem("cart", JSON.stringify(state));
        },

        removeFromcart: (state, { payload }) => {

            const removeItem = state.items.find(
                (item) => item.id === payload.id
            );

            if (removeItem) {
                state.original_total -= Number(removeItem.originalPrice) * removeItem.qty;
                state.final_total -= Number(removeItem.salePrice) * removeItem.qty;
            }

            state.items = state.items.filter(
                (item) => item.id !== payload.id
            );

            localStorage.setItem("cart", JSON.stringify(state));
        },

        emptyCart: (state) => {

            state.items = [];
            state.original_total = 0;
            state.final_total = 0;

            localStorage.removeItem("cart");
        },

        increaseQuantity: (state, { payload }) => {

            const cartItem = state.items.find(
                (item) => item.id === payload.id
            );

            if (!cartItem) return;

            cartItem.qty += 1;

            state.original_total += Number(cartItem.originalPrice);
            state.final_total += Number(cartItem.salePrice);

            localStorage.setItem("cart", JSON.stringify(state));
        },

        decreaseQuantity: (state, { payload }) => {

            const cartItem = state.items.find(
                (item) => item.id === payload.id
            );

            if (!cartItem) return;

            if (cartItem.qty > 1) {

                cartItem.qty -= 1;

                state.original_total -= Number(cartItem.originalPrice);
                state.final_total -= Number(cartItem.salePrice);

            } else {

                state.original_total -= Number(cartItem.originalPrice);
                state.final_total -= Number(cartItem.salePrice);

                state.items = state.items.filter(
                    (item) => item.id !== payload.id
                );
            }

            localStorage.setItem("cart", JSON.stringify(state));
        },

        lsToCart: (state) => {
            try {
                const cart = JSON.parse(localStorage.getItem("cart"));

                if (cart) {
                    state.items = cart.items || [];
                    state.original_total = cart.original_total || 0;
                    state.final_total = cart.final_total || 0;
                }
            } catch (error) {
                console.error("Invalid cart in localStorage:", error);

                state.items = [];
                state.original_total = 0;
                state.final_total = 0;
            }
        }
    },
});

export const {
    addToCart,
    removeFromcart,
    emptyCart,
    increaseQuantity,
    decreaseQuantity,
    lsToCart
} = cartSlice.actions;

export default cartSlice.reducer;