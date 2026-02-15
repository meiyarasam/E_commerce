import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-8">
                <Link to="/admin/products" className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition flex flex-col items-center justify-center text-center">
                    <Package size={48} className="text-amber-500 mb-4" />
                    <h2 className="text-xl font-bold">Products</h2>
                    <p className="text-gray-500 mt-2">Manage products, inventory, and pricing</p>
                </Link>

                <Link to="/admin/orders" className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition flex flex-col items-center justify-center text-center">
                    <ShoppingBag size={48} className="text-green-500 mb-4" />
                    <h2 className="text-xl font-bold">Orders</h2>
                    <p className="text-gray-500 mt-2">View orders, update status, and track sales</p>
                </Link>

                <Link to="/admin/users" className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition flex flex-col items-center justify-center text-center">
                    <Users size={48} className="text-blue-500 mb-4" />
                    <h2 className="text-xl font-bold">Users</h2>
                    <p className="text-gray-500 mt-2">View registered users and customers</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
