"use client";

import React, { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { lsToCart } from "./features/cartSlice";

function LoadCart({ children }) {
    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        dispatch(lsToCart());
        setReady(true);
    }, [dispatch]);

    if (!ready) {
        return null;
    }

    return children;
}

export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            <LoadCart>
                {children}
            </LoadCart>
        </Provider>
    );
}