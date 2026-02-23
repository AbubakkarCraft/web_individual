import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../services/api';
import toast from 'react-hot-toast';
import { Book as BookIcon, Search, Filter } from 'lucide-react';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

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

    const categories = ['All', ...new Set(books.map(book => book.category))];

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome back, {username}!</h1>
                        <p className="text-gray-500 font-medium">Pick up where you left off or discover something new.</p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-12 flex flex-col lg:flex-row gap-6 items-center">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                        <div className="flex-shrink-0 flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px] px-2">
                            <Filter size={14} />
                            Genres
                        </div>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'bg-white text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-100'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {filteredBooks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
                                {filteredBooks.map((book) => (
                                    <div key={book.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer">
                                        <Link to={`/book/${book.id}`} className="flex-grow">
                                            <div className="aspect-[2/3] overflow-hidden bg-gray-100 relative">
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-indigo-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm">
                                                    {book.category}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{book.title}</h3>
                                                <p className="text-gray-500 text-sm font-medium mb-4 italic">by {book.author}</p>
                                                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed font-medium">
                                                    {book.description}
                                                </p>
                                            </div>
                                        </Link>
                                        <div className="px-6 pb-6 mt-auto">
                                            <Link to={`/book/${book.id}`} className="w-full bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-[10px] py-3.5 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                                <BookIcon size={14} />
                                                Read Now
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 animate-fade-in">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="text-gray-200" size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">No results found</h3>
                                <p className="text-gray-500 font-medium italic">We couldn't find any books matching "{searchQuery}" in {selectedCategory}.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                    className="mt-8 text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
