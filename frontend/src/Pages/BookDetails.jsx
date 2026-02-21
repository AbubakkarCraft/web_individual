import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Book as BookIcon } from 'lucide-react';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data } = await getBookById(id);
                setBook(data);
            } catch (err) {
                toast.error('Failed to load book details');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900">Book not found</h2>
                <Link to="/dashboard" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gray-100 aspect-[2/3]">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-2/3 p-8 md:p-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                            <div className="flex items-center gap-6 mb-8">
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                    {book.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                    <BookIcon size={16} className="text-indigo-400" />
                                    {book.content ? `${book.content.length} Pages` : 'No pages available'}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {book.description}
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <Link
                                        to={`/read/${book.id}`}
                                        className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                                    >
                                        <BookIcon size={20} />
                                        Start Reading
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
