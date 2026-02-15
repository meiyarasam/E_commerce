import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { User, Package, X, Check } from 'lucide-react';

const ProfileScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchMyOrders();
        }
    }, [user, navigate]);

    const fetchMyOrders = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/orders/myorders', config);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={40} className="text-amber-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="text-gray-500 mb-4">{user?.email}</p>
                    {user?.isAdmin && (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Admin</span>
                    )}
                </div>
            </div>

            <div className="md:col-span-3">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Package className="mr-2" /> My Orders
                </h2>

                {loading ? (
                    <div>Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-blue-50 text-blue-800 p-4 rounded text-center">
                        You have no orders yet. <Link to="/" className="underline font-bold">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{order.totalPrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.isPaid ? (
                                                <span className="text-green-600 flex items-center"><Check size={16} className="mr-1" /> Paid</span>
                                            ) : (
                                                <span className="text-red-600 flex items-center"><X size={16} className="mr-1" /> Not Paid</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.isDelivered ? (
                                                <span className="text-green-600 flex items-center"><Check size={16} className="mr-1" /> Delivered</span>
                                            ) : (
                                                <span className="text-red-600 flex items-center"><X size={16} className="mr-1" /> Not Delivered</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/order/${order._id}`} className="text-indigo-600 hover:text-indigo-900">Details</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileScreen;
