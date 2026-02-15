import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=shipping');
        } else {
            navigate('/shipping'); // Will implement shipping later
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-md">
                    Your cart is empty. <Link to="/" className="font-bold underline">Go Back</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {cartItems.map((item) => (
                            <div key={item.product} className="flex flex-col md:flex-row items-center justify-between bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-100">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mb-4 md:mb-0" />

                                <div className="flex-1 md:ml-4 text-center md:text-left">
                                    <Link to={`/product/${item.product}`} className="text-lg font-semibold hover:text-amber-600">
                                        {item.name}
                                    </Link>
                                </div>

                                <div className="md:mx-6 font-bold text-gray-700">₹{item.price}</div>

                                <div className="md:mx-6">
                                    <select
                                        value={item.qty}
                                        onChange={(e) => addToCart(item, Number(e.target.value))} // We pass full item here so we need to fix addToCart in context to handle this structure or just pass the required fields
                                        className="border rounded p-1"
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.product)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                        <div className="text-2xl font-bold mb-6 text-gray-900">
                            ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </div>
                        <button
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                            className="w-full bg-amber-500 text-white py-3 rounded-md font-bold hover:bg-amber-600 transition shadow-md disabled:bg-gray-300"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
