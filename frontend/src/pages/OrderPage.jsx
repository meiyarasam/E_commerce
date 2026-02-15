import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const OrderPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    const deliverHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/orders/${id}/deliver`, {}, config);
            // Refresh order
            const { data } = await axios.get(`/api/orders/${id}`, config);
            setOrder(data);
        } catch (error) {
            console.error(error);
        }
    };

    const payHandler = async () => {
        // Mock payment implementation - in real world this would use SDK
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const paymentResult = {
                id: 'MOCK_PAYMENT_ID',
                status: 'COMPLETED',
                update_time: Date.now(),
                email_address: user.email,
            };
            await axios.put(`/api/orders/${id}/pay`, paymentResult, config);
            // Refresh order
            const { data } = await axios.get(`/api/orders/${id}`, config);
            setOrder(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
                    <h2 className="text-xl font-bold mb-2">Shipping</h2>
                    <p><strong>Name: </strong> {order.user.name}</p>
                    <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-500">{order.user.email}</a></p>
                    <p>
                        <strong>Address: </strong>
                        {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (
                        <div className="bg-green-100 text-green-700 p-2 mt-2 rounded">Delivered on {order.deliveredAt.substring(0, 10)}</div>
                    ) : (
                        <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">Not Delivered</div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
                    <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                    <p><strong>Method: </strong> {order.paymentMethod}</p>
                    {order.isPaid ? (
                        <div className="bg-green-100 text-green-700 p-2 mt-2 rounded">Paid on {order.paidAt.substring(0, 10)}</div>
                    ) : (
                        <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">Not Paid</div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Order Items</h2>
                    {order.orderItems.length === 0 ? <p>Order is empty</p> : (
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
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
                    <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between mb-4 border-t pt-2 font-bold text-lg">
                    <span>Total</span>
                    <span>₹{order.totalPrice}</span>
                </div>

                {!order.isPaid && (
                    <div className="mb-4">
                        <button onClick={payHandler} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                            Mark as Paid (Mock UPI)
                        </button>
                    </div>
                )}

                {user && user.isAdmin && order.isPaid && !order.isDelivered && (
                    <div className="mb-4">
                        <button onClick={deliverHandler} className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition">
                            Mark As Delivered
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPage;
