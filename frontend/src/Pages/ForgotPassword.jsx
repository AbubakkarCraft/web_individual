import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await forgotPassword(email);
            setMessage(data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            setMessage('');
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-200 p-10">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Reset Password</h2>
                <p className="text-gray-600 text-sm text-center mb-6">Enter your email and we'll send you a link to reset your password.</p>
                {message && <p className="text-green-500 text-sm text-center mb-4">{message}</p>}
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
                    >
                        Send Reset Link
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Back to <Link to="/signin" className="text-indigo-600 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
