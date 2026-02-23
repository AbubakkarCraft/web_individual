import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, toggleWishlist } from '../services/api';
import toast from 'react-hot-toast';
import { Book as BookIcon, Heart, Trash2, ArrowRight } from 'lucide-react';

const Wishlist = () => {
    const [savedBooks, setSavedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await getWishlist();
                setSavedBooks(data);
            } catch (err) {
                toast.error('Failed to load wishlist');
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const handleRemove = async (bookId) => {
        try {
            await toggleWishlist(bookId);
            setSavedBooks(savedBooks.filter(item => item.bookId !== bookId));
            toast.success('Removed from wishlist');
        } catch (err) {
            toast.error('Failed to remove book');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                        <Heart size={32} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">My Wishlist</h1>
                        <p className="text-gray-500 font-medium">Your personal collection of must-reads and favorites.</p>
                    </div>
                </div>

                {savedBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedBooks.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex animate-slide-up group">
                                <div className="w-1/3 aspect-[2/3] bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={item.book.coverImage}
                                        alt={item.book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="w-2/3 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                                {item.book.category}
                                            </span>
                                            <button
                                                onClick={() => handleRemove(item.bookId)}
                                                className="text-gray-300 hover:text-rose-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.book.title}</h3>
                                        <p className="text-gray-500 text-sm font-medium mb-4 italic">by {item.book.author}</p>
                                    </div>
                                    <Link
                                        to={`/book/${item.bookId}`}
                                        className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:gap-3 transition-all"
                                    >
                                        Details <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <Heart className="mx-auto text-gray-200 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is lonely</h3>
                        <p className="text-gray-500 font-medium mb-8">Start exploring and save books you'd love to read!</p>
                        <Link
                            to="/dashboard"
                            className="bg-indigo-600 text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            Browse Library
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
