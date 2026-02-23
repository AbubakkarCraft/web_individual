import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    getBookById, getComments, postComment, getWishlist,
    toggleWishlist, getNotes, postNote, deleteNote,
    getUserRating, submitRating
} from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Book as BookIcon, MessageSquare, Send, User as UserIcon, Heart, Notebook, Trash2, Plus, Star } from 'lucide-react';
import StarRating from '../components/StarRating';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Wishlist State
    const [isSaved, setIsSaved] = useState(false);

    // Notes State
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [showNoteInput, setShowNoteInput] = useState(false);

    // Rating State
    const [userRating, setUserRating] = useState(0);
    const [ratingStats, setRatingStats] = useState({ averageRating: 0, ratingCount: 0 });

    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [bookRes, commentsRes] = await Promise.all([
                    getBookById(id),
                    getComments(id)
                ]);
                setBook(bookRes.data);
                setComments(commentsRes.data);
                setRatingStats({
                    averageRating: parseFloat(bookRes.data.averageRating) || 0,
                    ratingCount: parseInt(bookRes.data.ratingCount) || 0
                });

                // Fetch Wishlist, Notes, and User Rating if logged in
                if (localStorage.getItem('token')) {
                    const [wishlistRes, notesRes, userRatingRes] = await Promise.all([
                        getWishlist(),
                        getNotes(id),
                        getUserRating(id)
                    ]);
                    const inWishlist = wishlistRes.data.some(item => item.bookId === id);
                    setIsSaved(inWishlist);
                    setNotes(notesRes.data);
                    setUserRating(userRatingRes.data.score || 0);
                }
            } catch (err) {
                console.error('Error fetching details:', err);
                toast.error('Failed to load book details');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const handleRating = async (score) => {
        if (!localStorage.getItem('token')) {
            toast.error('Sign in to leave a rating');
            return;
        }

        try {
            const { data } = await submitRating(id, score);
            setUserRating(score);

            // Refresh book stats to get new average
            const bookRes = await getBookById(id);
            setRatingStats({
                averageRating: parseFloat(bookRes.data.averageRating) || 0,
                ratingCount: parseInt(bookRes.data.ratingCount) || 0
            });

            toast.success(userRating > 0 ? 'Rating updated!' : 'Thank you for rating!');
        } catch (err) {
            toast.error('Failed to submit rating');
        }
    };

    const handleWishlistToggle = async () => {
        if (!localStorage.getItem('token')) {
            toast.error('Please sign in to save books');
            return;
        }

        try {
            const { data } = await toggleWishlist(id);
            setIsSaved(data.saved);
            toast.success(data.message);
        } catch (err) {
            toast.error('Failed to update wishlist');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!localStorage.getItem('token')) {
            toast.error('Please sign in to comment');
            return;
        }

        setSubmitting(true);
        try {
            const { data } = await postComment({ bookId: id, text: newComment });
            setComments([data, ...comments]);
            setNewComment('');
            toast.success('Comment posted!');
        } catch (err) {
            console.error('Error posting comment:', err);
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            const { data } = await postNote({ bookId: id, text: newNote });
            setNotes([data, ...notes]);
            setNewNote('');
            setShowNoteInput(false);
            toast.success('Note saved!');
        } catch (err) {
            toast.error('Failed to save note');
        }
    };

    const handleNoteDelete = async (noteId) => {
        try {
            await deleteNote(noteId);
            setNotes(notes.filter(note => note.id !== noteId));
            toast.success('Note deleted');
        } catch (err) {
            toast.error('Failed to delete note');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-[#0f1115] transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center py-20 bg-gray-50 dark:bg-[#0f1115] min-h-screen transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book not found</h2>
                <Link to="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] py-12 px-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>
                    <button
                        onClick={handleWishlistToggle}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all shadow-sm ${isSaved
                            ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 ring-rose-500'
                            : 'bg-white dark:bg-[#161b22] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-[#21262d] hover:border-rose-100 dark:hover:border-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                    >
                        <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'animate-pulse' : ''} />
                        {isSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>

                <div className="bg-white dark:bg-[#161b22] rounded-[3rem] shadow-sm border border-gray-100 dark:border-[#21262d] overflow-hidden mb-12 transition-colors">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gray-100 dark:bg-[#0f1115] aspect-[2/3] relative group">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-white/90">
                                        <Star size={16} fill="#fbbf24" className="text-amber-400" />
                                        <span className="font-black text-xl">{ratingStats.averageRating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{ratingStats.ratingCount} Global Ratings</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8 md:p-12">
                            <div className="mb-6">
                                <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg mb-4 inline-block">
                                    {book.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 leading-tight uppercase tracking-tight tracking-tight">{book.title}</h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium italic">by {book.author}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <BookIcon size={14} />
                                    {book.content ? `${book.content.length} Pages` : 'No pages'}
                                </div>
                                <div className="flex items-center gap-4 border-l pl-4 border-gray-100 dark:border-[#21262d]">
                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Rate this:</span>
                                    <StarRating
                                        rating={userRating}
                                        interactive={true}
                                        onRate={handleRating}
                                        size={22}
                                    />
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-4">The Narrative</h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium italic">
                                        "{book.description}"
                                    </p>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to={`/read/${book.id}`}
                                        className="flex-grow bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] py-5 px-8 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 dark:shadow-none"
                                    >
                                        <BookIcon size={18} />
                                        Enter Sanctuary
                                    </Link>
                                    <button
                                        onClick={() => setShowNoteInput(!showNoteInput)}
                                        className="bg-white dark:bg-transparent text-gray-900 dark:text-white border-2 border-gray-100 dark:border-[#21262d] font-black uppercase tracking-widest text-[10px] py-5 px-8 rounded-2xl hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Notebook size={18} />
                                        Leave Verse
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Notes Section */}
                {username && (
                    <div className="bg-amber-50 dark:bg-amber-950/10 rounded-[3rem] border border-amber-100 dark:border-amber-900/30 p-8 md:p-12 mb-12 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-xl text-amber-700 dark:text-amber-500">
                                    <Notebook size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-amber-900 dark:text-amber-200 tracking-tight uppercase">Personal Verses</h2>
                            </div>
                            {!showNoteInput && (
                                <button
                                    onClick={() => setShowNoteInput(true)}
                                    className="bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 p-3 rounded-2xl hover:bg-amber-300 dark:hover:bg-amber-700 transition-all shadow-sm"
                                >
                                    <Plus size={20} />
                                </button>
                            )}
                        </div>

                        {showNoteInput && (
                            <form onSubmit={handleNoteSubmit} className="mb-10 animate-fade-in">
                                <div className="relative">
                                    <textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Capture a fragment of your journey..."
                                        className="w-full bg-white dark:bg-[#0f1115] border-2 border-amber-200 dark:border-amber-900/30 rounded-3xl p-8 min-h-[160px] focus:ring-8 focus:ring-amber-100 dark:focus:ring-amber-900/10 outline-none transition-all resize-none font-medium text-amber-900 dark:text-amber-100 placeholder:text-amber-200 dark:placeholder:text-amber-800 shadow-inner"
                                        autoFocus
                                    />
                                    <div className="absolute bottom-6 right-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowNoteInput(false)}
                                            className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-amber-600 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900 transition-all"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!newNote.trim()}
                                            className="bg-amber-800 dark:bg-amber-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-900 dark:hover:bg-amber-500 transition-all disabled:opacity-50 shadow-lg shadow-amber-200 dark:shadow-none"
                                        >
                                            Save Verse
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <div key={note.id} className="bg-white dark:bg-[#161b22] p-8 rounded-[2rem] border border-amber-100 dark:border-amber-900/20 shadow-sm relative group animate-slide-up">
                                        <button
                                            onClick={() => handleNoteDelete(note.id)}
                                            className="absolute top-6 right-6 text-amber-200 dark:text-amber-800 hover:text-rose-600 dark:hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="text-[10px] font-black text-amber-400 dark:text-amber-600 uppercase tracking-widest mb-4">
                                            {new Date(note.createdAt).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </div>
                                        <p className="text-amber-900 dark:text-amber-200 font-medium leading-relaxed italic text-lg">
                                            "{note.text}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="md:col-span-2 text-center py-16 bg-white/50 dark:bg-[#161b22]/50 rounded-[2.5rem] border-2 border-dashed border-amber-200 dark:border-amber-900/30">
                                    <p className="text-amber-600 dark:text-amber-700 font-black uppercase tracking-[0.2em] text-[10px]">Your chronicles are empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="bg-white dark:bg-[#161b22] rounded-[3rem] shadow-sm border border-gray-100 dark:border-[#21262d] p-8 md:p-12 transition-colors">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <MessageSquare size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Shared Echoes ({comments.length})</h2>
                    </div>

                    {/* New Comment Input */}
                    <div className="mb-12">
                        {username ? (
                            <form onSubmit={handleCommentSubmit} className="relative group">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add your echo to the world..."
                                    disabled={submitting}
                                    className="w-full bg-gray-50 dark:bg-[#0f1115] border-2 border-gray-100 dark:border-[#21262d] rounded-[2rem] p-8 min-h-[160px] focus:ring-8 focus:ring-indigo-50 dark:focus:ring-indigo-950/10 focus:border-indigo-100 dark:focus:border-indigo-900 focus:bg-white dark:focus:bg-[#0f1115] outline-none transition-all disabled:opacity-50 resize-none font-medium text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="absolute bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-2xl shadow-indigo-100 dark:shadow-none group-hover:scale-110 active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        ) : (
                            <div className="bg-gray-50 dark:bg-[#0f1115] border-2 border-dashed border-gray-100 dark:border-[#21262d] rounded-[3rem] p-12 text-center group hover:border-indigo-300 transition-all">
                                <UserIcon className="mx-auto text-gray-200 dark:text-gray-800 mb-6 group-hover:text-indigo-400 transition-colors" size={48} />
                                <h3 className="text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs mb-3">Community Dialogue</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-sm mx-auto">Sign in to leave your mark on this chronicle and join the discussion.</p>
                                <Link
                                    to="/signin"
                                    className="inline-block bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
                                >
                                    Sign In to Participate
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Comments List */}
                    <div className="space-y-12">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-6 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-[1.2rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            <UserIcon size={32} />
                                        </div>
                                    </div>
                                    <div className="flex-grow pt-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tighter">{comment.user?.username || 'Reader'}</span>
                                                <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-[#0f1115] p-6 rounded-[1.8rem] rounded-tl-none border border-gray-100/50 dark:border-[#21262d] group-hover:bg-white dark:group-hover:bg-[#161b22] group-hover:shadow-md transition-all duration-500">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-50/50 dark:bg-[#0f1115]/50 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-[#21262d]">
                                <MessageSquare className="mx-auto text-gray-100 dark:text-[#21262d] mb-8" size={64} />
                                <p className="text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest text-[10px]">The echoes are silent.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
