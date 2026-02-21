import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const Reader = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            console.log('Reader: Fetching book with ID:', id);
            try {
                const { data } = await getBookById(id);
                console.log('Reader: Received book data:', data);
                setBook(data);
            } catch (err) {
                console.error('Reader: Error fetching book:', err);
                toast.error('Failed to load book content');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleNext = () => {
        if (book?.content && currentPage < book.content.length - 1) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-stone-50 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
                <p className="text-stone-500 font-medium animate-pulse">Opening your book...</p>
            </div>
        );
    }

    if (!book || !book.content || !Array.isArray(book.content) || book.content.length === 0) {
        return (
            <div className="text-center py-20 bg-stone-50 min-h-screen flex flex-col justify-center items-center px-6">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-200 max-w-md w-full">
                    <BookOpen size={48} className="mx-auto text-stone-300 mb-6" />
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">Content Not Available</h2>
                    <p className="text-stone-500 mb-8 leading-relaxed">
                        We couldn't find the pages for this book. Please try refreshing or pick another title.
                    </p>
                    <Link to="/dashboard" className="inline-block w-full bg-amber-800 text-white font-bold py-4 rounded-xl hover:bg-amber-900 transition-all shadow-lg shadow-amber-100">
                        Back to Library
                    </Link>
                </div>
            </div>
        );
    }

    const progress = ((currentPage + 1) / book.content.length) * 100;

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 py-12 px-6 font-serif selection:bg-amber-200">
            <div className="max-w-4xl mx-auto">
                {/* Immersive Header */}
                <div className="flex items-center justify-between mb-16 border-b border-stone-200 pb-6 no-print animate-fade-in">
                    <Link to={`/book/${id}`} className="flex items-center gap-2 text-stone-400 hover:text-amber-800 transition-all group">
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-sans font-bold">Close</span>
                    </Link>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-sans font-black uppercase tracking-[0.2em] text-stone-400 mb-1">Now Reading</span>
                        <h2 className="text-sm font-sans font-bold text-stone-800 text-center line-clamp-1">{book.title}</h2>
                    </div>
                    <div className="text-sm font-sans font-black text-amber-900 bg-amber-100/50 px-4 py-1.5 rounded-full">
                        {currentPage + 1} <span className="text-amber-900/40 mx-1">/</span> {book.content.length}
                    </div>
                </div>

                {/* The Page */}
                <div className="relative group animate-slide-up">
                    <div className="absolute inset-0 bg-stone-200 rounded-3xl translate-x-3 translate-y-3 -z-10 opacity-30"></div>
                    <div className="bg-white p-10 md:p-20 rounded-3xl border border-stone-100 book-shadow min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Decorative Book Elements */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-stone-100 to-transparent"></div>

                        <div className="max-w-2xl w-full">
                            <p className="text-3xl md:text-4xl leading-[1.6] text-stone-800 first-letter:text-7xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-amber-900 first-letter:leading-none">
                                {book.content[currentPage]}
                            </p>
                        </div>

                        {/* Pagination indicator dots */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {book.content.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-amber-800 w-4' : 'bg-stone-200'}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Immersive Controls */}
                <div className="flex items-center justify-between mt-16 no-print animate-fade-in">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 0}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-sans font-bold transition-all shadow-sm ${currentPage === 0
                                ? 'text-stone-300 bg-stone-100 cursor-not-allowed border-transparent'
                                : 'text-stone-700 bg-white border border-stone-200 hover:border-amber-800 hover:text-amber-800 hover:shadow-md'
                            }`}
                    >
                        <ChevronLeft size={24} />
                        Previous
                    </button>

                    <div className="flex-grow max-w-xs mx-8 hidden md:block">
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-800 transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === book.content.length - 1}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-sans font-bold transition-all shadow-sm ${currentPage === book.content.length - 1
                                ? 'text-stone-300 bg-stone-100 cursor-not-allowed border-transparent'
                                : 'text-stone-700 bg-white border border-stone-200 hover:border-amber-800 hover:text-amber-800 hover:shadow-md'
                            }`}
                    >
                        Next
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Finished State */}
                {currentPage === book.content.length - 1 && (
                    <div className="text-center mt-20 bg-amber-900 text-white p-12 rounded-[2rem] border border-amber-800 shadow-2xl shadow-amber-200/50 animate-slide-up">
                        <div className="bg-amber-800/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-700/50">
                            <BookOpen size={40} className="text-amber-200" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 font-sans italic tracking-tight">You've finished the preview!</h3>
                        <p className="text-amber-200/80 mb-10 font-sans text-lg max-w-md mx-auto">
                            We hope you enjoyed these opening chapters of <span className="text-white font-bold">{book.title}</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/dashboard" className="bg-white text-amber-900 font-sans font-black px-10 py-4 rounded-2xl hover:bg-amber-50 transition-all shadow-xl">
                                Discover More
                            </Link>
                            <button className="bg-amber-800/50 text-white border border-amber-700 font-sans font-bold px-10 py-4 rounded-2xl hover:bg-amber-800 transition-all">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reader;
