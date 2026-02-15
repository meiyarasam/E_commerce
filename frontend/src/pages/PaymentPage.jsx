import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const PaymentPage = () => {
    const { shippingAddress, savePaymentMethod } = useContext(CartContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('UPI');

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Payment Method</h1>

                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <label className="flex items-center space-x-3 mb-3 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={paymentMethod === 'UPI'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="form-radio h-5 w-5 text-amber-500"
                            />
                            <span className="text-gray-700 font-medium">UPI / QR Code</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
