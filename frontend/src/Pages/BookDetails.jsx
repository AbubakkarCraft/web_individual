import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById, getComments, postComment, getWishlist, toggleWishlist, getNotes, postNote, deleteNote } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Book as BookIcon, MessageSquare, Send, User as UserIcon, Heart, Notebook, Trash2, Plus } from 'lucide-react';

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

                // Fetch Wishlist and Notes if logged in
                if (localStorage.getItem('token')) {
                    const [wishlistRes, notesRes] = await Promise.all([
                        getWishlist(),
                        getNotes(id)
                    ]);
                    const inWishlist = wishlistRes.data.some(item => item.bookId === id);
                    setIsSaved(inWishlist);
                    setNotes(notesRes.data);
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
                <div className="flex items-center justify-between mb-8">
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>
                    <button
                        onClick={handleWishlistToggle}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all shadow-sm ${isSaved
                                ? 'bg-rose-50 text-rose-600 border border-rose-100 ring-rose-500'
                                : 'bg-white text-gray-600 border border-gray-100 hover:border-rose-100 hover:text-rose-600'
                            }`}
                    >
                        <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'animate-pulse' : ''} />
                        {isSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gray-100 aspect-[2/3] relative group">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="md:w-2/3 p-8 md:p-12">
                            <div className="mb-6">
                                <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg mb-4 inline-block">
                                    {book.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight">{book.title}</h1>
                                <p className="text-xl text-gray-500 font-medium italic">by {book.author}</p>
                            </div>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                                    <BookIcon size={14} />
                                    {book.content ? `${book.content.length} Pages` : 'No pages'}
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">The Story</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                        {book.description}
                                    </p>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to={`/read/${book.id}`}
                                        className="flex-grow bg-indigo-600 text-white font-black uppercase tracking-widest text-xs py-5 px-8 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200"
                                    >
                                        <BookIcon size={18} />
                                        Start Reading
                                    </Link>
                                    <button
                                        onClick={() => setShowNoteInput(!showNoteInput)}
                                        className="bg-white text-gray-900 border-2 border-gray-100 font-black uppercase tracking-widest text-xs py-5 px-8 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Notebook size={18} />
                                        Leave Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Notes Section */}
                {username && (
                    <div className="bg-amber-50 rounded-3xl border border-amber-100 p-8 md:p-12 mb-12 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
                                    <Notebook size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-amber-900 tracking-tight">Personal Notes</h2>
                            </div>
                            {!showNoteInput && (
                                <button
                                    onClick={() => setShowNoteInput(true)}
                                    className="bg-amber-200 text-amber-900 p-2.5 rounded-xl hover:bg-amber-300 transition-all"
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
                                        placeholder="Write down your thoughts, favorite quotes, or reminders..."
                                        className="w-full bg-white border-2 border-amber-200 rounded-2xl p-6 min-h-[150px] focus:ring-4 focus:ring-amber-200 outline-none transition-all resize-none font-medium text-amber-900 placeholder:text-amber-200 shadow-inner"
                                        autoFocus
                                    />
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowNoteInput(false)}
                                            className="px-6 py-2.5 rounded-xl font-bold text-amber-700 hover:bg-amber-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!newNote.trim()}
                                            className="bg-amber-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-900 transition-all disabled:opacity-50 shadow-md"
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <div key={note.id} className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm relative group animate-slide-up">
                                        <button
                                            onClick={() => handleNoteDelete(note.id)}
                                            className="absolute top-4 right-4 text-amber-200 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">
                                            {new Date(note.createdAt).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </div>
                                        <p className="text-amber-900 font-medium leading-relaxed italic">
                                            "{note.text}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="md:col-span-2 text-center py-10 bg-white/50 rounded-2xl border border-dashed border-amber-200">
                                    <p className="text-amber-600 font-medium italic">Your notes are a blank page—start writing your journey!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                            <MessageSquare size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Public Discussion ({comments.length})</h2>
                    </div>

                    {/* New Comment Input */}
                    <form onSubmit={handleCommentSubmit} className="mb-12">
                        <div className="relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={username ? "Add your voice to the conversation..." : "Sign in to share your thoughts"}
                                disabled={!username || submitting}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 min-h-[120px] focus:ring-4 focus:ring-indigo-50 outline-none transition-all disabled:opacity-50 resize-none font-medium text-gray-700 placeholder:text-gray-300"
                            />
                            <button
                                type="submit"
                                disabled={!username || submitting || !newComment.trim()}
                                className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md shadow-indigo-200"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-10">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-5 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                                            <UserIcon size={28} />
                                        </div>
                                    </div>
                                    <div className="flex-grow pt-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-sm text-gray-900 uppercase tracking-tighter">{comment.user?.username || 'Reader'}</span>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed font-medium bg-gray-50/50 p-4 rounded-2xl rounded-tl-none border border-gray-100/50">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <MessageSquare className="mx-auto text-gray-200 mb-6" size={56} />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No comments yet—be the first to speak!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
