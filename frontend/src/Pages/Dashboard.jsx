import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getAllProgress } from '../services/api';
import toast from 'react-hot-toast';
import { Book as BookIcon, Search, Filter, Play, Clock, Star } from 'lucide-react';
import StarRating from '../components/StarRating';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [recentProgress, setRecentProgress] = useState(null);

    const username = localStorage.getItem('username') || 'Reader';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const booksRes = await getBooks();
                setBooks(booksRes.data);

                if (localStorage.getItem('token')) {
                    const progressRes = await getAllProgress();
                    if (progressRes.data && progressRes.data.length > 0) {
                        setRecentProgress(progressRes.data[0]); // Get the most recently read book
                    }
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.reload();
                    return;
                }
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const categories = ['All', ...new Set(books.map(book => book.category))];

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] py-12 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight leading-none uppercase">
                            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{username}</span>!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium italic">Your literary sanctuary is waiting. Pick up where you left off.</p>
                    </div>
                </div>

                {/* Continue Reading Section */}
                {recentProgress && (
                    <div className="mb-16 animate-slide-up">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-indigo-600 dark:text-indigo-400" size={20} />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">Continue Reading</h2>
                        </div>
                        <Link
                            to={`/read/${recentProgress.book.id}`}
                            className="group block bg-white dark:bg-[#161b22] rounded-[2.5rem] border border-gray-100 dark:border-[#21262d] shadow-sm overflow-hidden hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all duration-500"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-8 p-8">
                                <div className="w-full md:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-gray-50 dark:border-transparent">
                                    <img
                                        src={recentProgress.book.coverImage}
                                        alt={recentProgress.book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
                                        {recentProgress.book.category}
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{recentProgress.book.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium italic mb-4">by {recentProgress.book.author}</p>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <div className="bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none group-hover:bg-indigo-700 transition-all">
                                            <Play size={14} fill="currentColor" />
                                            Resume on Verse {recentProgress.currentPage + 1}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 dark:text-gray-500">
                                            Last read {new Date(recentProgress.lastRead).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-[#161b22] p-5 rounded-[2.5rem] border border-gray-100 dark:border-[#21262d] shadow-sm mb-12 flex flex-col lg:flex-row gap-6 items-center">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-14 pr-6 py-5 bg-gray-50 dark:bg-[#0f1115] border-none rounded-3xl w-full focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950/20 outline-none font-medium transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0 scroll-smooth">
                        <div className="flex-shrink-0 flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px] px-2">
                            <Filter size={14} />
                            Genres
                        </div>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${selectedCategory === category
                                    ? 'bg-indigo-600 text-white border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-100 dark:shadow-none'
                                    : 'bg-white dark:bg-[#161b22] text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#21262d] border-gray-100 dark:border-[#21262d]'
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
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {filteredBooks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredBooks.map((book) => (
                                    <div key={book.id} className="bg-white dark:bg-[#161b22] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-[#21262d] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col cursor-pointer animate-fade-in">
                                        <Link to={`/book/${book.id}`} className="flex-grow">
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-[#0f1115] relative">
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                                <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/60 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-lg border border-transparent dark:border-white/10">
                                                    {book.category}
                                                </div>
                                                {book.averageRating > 0 && (
                                                    <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-lg">
                                                        <Star size={12} fill="#fbbf24" className="text-amber-400" />
                                                        <span className="text-white text-[10px] font-black">{parseFloat(book.averageRating).toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center justify-between gap-4 mb-1">
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{book.title}</h3>
                                                </div>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium italic mb-4">by {book.author}</p>

                                                <div className="mb-4">
                                                    <StarRating rating={parseFloat(book.averageRating) || 0} size={14} />
                                                </div>

                                                <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-3 leading-relaxed font-medium italic">
                                                    "{book.description}"
                                                </p>
                                            </div>
                                        </Link>
                                        <div className="px-8 pb-8 mt-auto">
                                            <Link to={`/book/${book.id}`} className="w-full bg-indigo-50 dark:bg-[#21262d] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all flex items-center justify-center gap-2">
                                                <BookIcon size={14} />
                                                Explore Sanctuary
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white dark:bg-[#161b22] rounded-[3rem] border-4 border-dashed border-gray-50 dark:border-[#21262d] animate-fade-in shadow-inner">
                                <div className="bg-gray-50 dark:bg-[#0f1115] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-110 duration-500 shadow-sm">
                                    <Search className="text-gray-200 dark:text-gray-800" size={40} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">Ethereal Silence</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium italic max-w-sm mx-auto">No books match your current exploration. Try clearings the mist of filters.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                    className="mt-10 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] px-10 py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
                                >
                                    Reset Filters
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
