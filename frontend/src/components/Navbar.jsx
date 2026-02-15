import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-wider text-amber-500 hover:text-amber-400 transition">
                    ScrollMart
                </Link>

                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative hover:text-amber-500 transition">
                        <ShoppingCart size={24} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 hover:text-amber-500 transition focus:outline-none"
                            >
                                <User size={24} />
                                <span>{user.name}</span>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl py-2 z-50">
                                    <div className="px-4 py-2 border-b text-sm text-gray-500">
                                        Hello, {user.name}
                                    </div>
                                    {user.isAdmin && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="block px-4 py-2 hover:bg-gray-100 transition"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-100 transition"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center space-x-1 hover:text-amber-500 transition">
                            <User size={24} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
