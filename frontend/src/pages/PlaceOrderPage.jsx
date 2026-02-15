import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const PlaceOrderPage = () => {
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 500 ? 0 : 50); // Free shipping over 500
    const taxPrice = addDecimals(Number((0.18 * itemsPrice).toFixed(2))); // 18% GST
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                config
            );

            clearCart();
            setLoading(false);
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-6">Place Order</h1>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
                    <h2 className="text-xl font-bold mb-2">Shipping</h2>
                    <p>
                        <strong>Address: </strong>
                        {shippingAddress.address}, {shippingAddress.city},{' '}
                        {shippingAddress.postalCode}, {shippingAddress.country}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
                    <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                    <p>
                        <strong>Method: </strong>
                        {paymentMethod}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Order Items</h2>
                    {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                        <div className="space-y-4">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                        <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">{item.name}</Link>
                                    </div>
                                    <div className="text-gray-600">
                                        {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-fit">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
                <div className="flex justify-between mb-2">
                    <span>Items</span>
                    <span>₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>₹{shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>₹{taxPrice}</span>
                </div>
                <div className="flex justify-between mb-4 border-t pt-2 font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                </div>

                <button
                    disabled={cartItems.length === 0}
                    onClick={placeOrderHandler}
                    className="w-full bg-amber-500 text-white py-3 rounded-md font-bold hover:bg-amber-600 transition shadow-md disabled:bg-gray-300"
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
