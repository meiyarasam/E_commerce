import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <Link to={`/product/${product._id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
            </Link>
            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-amber-600 transition mb-2 truncate">
                        {product.name}
                    </h2>
                </Link>

                <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < 4.5 ? "currentColor" : "none"} className={i < 4.5 ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">({product.numReviews} active)</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    <Link
                        to={`/product/${product._id}`}
                        className="bg-amber-500 text-white px-3 py-1.5 rounded-md hover:bg-amber-600 transition text-sm font-medium"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}; // Mock rating logic for now

export default ProductCard;
