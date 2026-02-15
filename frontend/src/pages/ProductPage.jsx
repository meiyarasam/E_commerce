import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, Number(qty));
        navigate('/cart');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition">
                <ArrowLeft size={20} className="mr-1" />
                Back
            </button>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <img src={product.image} alt={product.name} className="w-full h-auto rounded-md" />
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill={i < 4.5 ? "currentColor" : "none"} className={i < 4.5 ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                        </div>
                        <span className="text-gray-500 ml-2">{product.numReviews} reviews</span>
                    </div>

                    <p className="text-2xl font-bold text-gray-900 mb-4">₹{product.price}</p>
                    <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <span className="font-semibold text-gray-700">Status:</span>
                            <span className={product.countInStock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-semibold text-gray-700">Quantity:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    className="border rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                >
                                    {[...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={addToCartHandler}
                            disabled={product.countInStock === 0}
                            className={`w-full flex items-center justify-center py-3 rounded-md text-white font-bold transition duration-300 ${product.countInStock === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg'
                                }`}
                        >
                            <ShoppingCart className="mr-2" size={20} />
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
