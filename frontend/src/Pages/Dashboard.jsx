import { useState, useEffect } from 'react';
import { getBooks } from '../services/api';
import toast from 'react-hot-toast';
import { Book as BookIcon, Search } from 'lucide-react';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username') || 'Reader';

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await getBooks();
                setBooks(data);
            } catch (err) {
                toast.error('Failed to load books');
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {username}!</h1>
                        <p className="text-gray-600">Pick up where you left off or discover something new.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {books.map((book) => (
                            <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                                <div className="aspect-[2/3] overflow-hidden bg-gray-100 relative">
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                                        {book.category}
                                    </span>
                                </div>
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">by {book.author}</p>
                                    <p className="text-gray-500 text-xs line-clamp-3 mb-6 leading-relaxed">
                                        {book.description}
                                    </p>
                                </div>
                                <div className="px-6 pb-6 mt-auto">
                                    <button className="w-full bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                        <BookIcon size={18} />
                                        Read Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {books.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <BookIcon className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-medium text-gray-900">No books found</h3>
                        <p className="text-gray-500">Try adjusting your search or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
