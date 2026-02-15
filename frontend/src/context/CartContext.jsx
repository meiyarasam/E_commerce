import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('UPI');

    useEffect(() => {
        const cartItemsFromStorage = localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [];
        const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {};

        setCartItems(cartItemsFromStorage);
        setShippingAddress(shippingAddressFromStorage);
    }, []);

    const addToCart = (product, qty) => {
        const existItem = cartItems.find((x) => x.product === product._id);
        let newItems;

        if (existItem) {
            newItems = cartItems.map((x) =>
                x.product === product._id ? { ...existItem, qty } : x
            );
        } else {
            newItems = [...cartItems, { ...product, product: product._id, qty }];
        }

        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
    };

    const removeFromCart = (id) => {
        const newItems = cartItems.filter((x) => x.product !== id);
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
        localStorage.setItem('shippingAddress', JSON.stringify(data));
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
        localStorage.setItem('paymentMethod', JSON.stringify(data));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, shippingAddress, paymentMethod, addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
