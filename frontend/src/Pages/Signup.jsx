import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            toast.success('Account created successfully! Please sign in.');
            navigate('/signin');
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong';
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#0f1115] flex items-center justify-center p-4 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-[#161b22] rounded-3xl shadow-sm border border-gray-200 dark:border-[#21262d] p-10">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Create Account</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Username</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#0f1115] border border-gray-300 dark:border-[#21262d] rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email Address</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#0f1115] border border-gray-300 dark:border-[#21262d] rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
                        <div className="mt-1 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="block w-full px-4 py-2 bg-gray-50 dark:bg-[#0f1115] border border-gray-300 dark:border-[#21262d] rounded-lg focus:ring-indigo-500 focus:border-indigo-500 pr-10 dark:text-white"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/signin" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
