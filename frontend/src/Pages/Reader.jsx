import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById, getNotes, postNote, deleteNote, getProgress, updateProgress } from '../services/api';
import toast from 'react-hot-toast';
import {
    ArrowLeft, ChevronLeft, ChevronRight, BookOpen, MessageSquare,
    Plus, Trash2, X, Settings2, Type, Palette, Monitor
} from 'lucide-react';

const Reader = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    // Reader Preferences
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('reader-font-size') || 'medium');
    const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('reader-font-family') || 'serif');
    const [theme, setTheme] = useState(() => localStorage.getItem('reader-theme') || 'paper');
    const [showSettings, setShowSettings] = useState(false);

    // Notes/Comments State
    const [notes, setNotes] = useState([]);
    const [showNotesSidebar, setShowNotesSidebar] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [submittingNote, setSubmittingNote] = useState(false);

    const username = localStorage.getItem('username');
    const isFirstRender = useRef(true);

    useEffect(() => {
        const initReader = async () => {
            try {
                const bookRes = await getBookById(id);
                setBook(bookRes.data);

                if (localStorage.getItem('token')) {
                    const [notesRes, progressRes] = await Promise.all([
                        getNotes(id),
                        getProgress(id)
                    ]);
                    setNotes(notesRes.data);
                    if (progressRes.data && progressRes.data.currentPage !== undefined) {
                        setCurrentPage(progressRes.data.currentPage);
                    }
                }
            } catch (err) {
                console.error('Reader Initialization Error:', err);
                toast.error('Failed to load your reading session');
            } finally {
                setLoading(false);
            }
        };
        initReader();
    }, [id]);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('reader-font-size', fontSize);
        localStorage.setItem('reader-font-family', fontFamily);
        localStorage.setItem('reader-theme', theme);
    }, [fontSize, fontFamily, theme]);

    // Sync progress to backend
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const syncProgress = async () => {
            if (localStorage.getItem('token')) {
                try {
                    await updateProgress(id, currentPage);
                } catch (err) {
                    console.error('Failed to sync progress');
                }
            }
        };

        const timer = setTimeout(syncProgress, 2000);
        return () => clearTimeout(timer);
    }, [currentPage, id]);

    const handleNext = () => {
        if (book?.content && currentPage < book.content.length - 1) {
            const next = currentPage + 1;
            setCurrentPage(next);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            const prev = currentPage - 1;
            setCurrentPage(prev);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim() || submittingNote) return;

        setSubmittingNote(true);
        try {
            const { data } = await postNote({
                bookId: id,
                text: newNote,
                pageNumber: currentPage
            });
            setNotes([data, ...notes]);
            setNewNote('');
            toast.success('Note pinned to this page');
        } catch (err) {
            toast.error('Failed to save note');
        } finally {
            setSubmittingNote(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deleteNote(noteId);
            setNotes(notes.filter(n => n.id !== noteId));
            toast.success('Note deleted');
        } catch (err) {
            toast.error('Failed to delete note');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-stone-50 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
                <p className="text-stone-500 font-medium animate-pulse italic">Preparing your sanctuary...</p>
            </div>
        );
    }

    if (!book || !book.content || !Array.isArray(book.content)) {
        return (
            <div className="text-center py-20 bg-stone-50 min-h-screen flex flex-col justify-center items-center px-6">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-200 max-w-md w-full">
                    <BookOpen size={48} className="mx-auto text-stone-300 mb-6" />
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">Content Not Available</h2>
                    <Link to="/dashboard" className="inline-block w-full bg-amber-800 text-white font-bold py-4 rounded-xl hover:bg-amber-900 transition shadow-lg">
                        Back to Library
                    </Link>
                </div>
            </div>
        );
    }

    const currentPageNotes = notes.filter(n => n.pageNumber === currentPage);
    const progressPerc = ((currentPage + 1) / book.content.length) * 100;

    // Theme Config
    const themes = {
        light: "bg-white text-stone-900",
        dark: "bg-[#121212] text-[#e0e0e0] border-[#333] selection:bg-indigo-500/30",
        sepia: "bg-[#f4ecd8] text-[#5b4636] selection:bg-[#d8c39d]",
        paper: "bg-[#fcf8f0] text-[#2c1810] selection:bg-[#e8d5b5]"
    };

    const pageBg = {
        light: "bg-stone-50",
        dark: "bg-black",
        sepia: "bg-[#e8dec0]",
        paper: "bg-[#f5e9d4]"
    };

    const fontSizes = {
        small: "text-lg md:text-xl",
        medium: "text-2xl md:text-3xl",
        large: "text-3xl md:text-4xl"
    };

    const fontFamilies = {
        serif: "font-serif",
        sans: "font-sans",
        mono: "font-mono"
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${pageBg[theme]} ${fontFamilies[fontFamily]} relative overflow-hidden`}>
            {/* Sidebar Overlay */}
            {(showNotesSidebar || showSettings) && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] animate-fade-in"
                    onClick={() => { setShowNotesSidebar(false); setShowSettings(false); }}
                ></div>
            )}

            {/* Notes Sidebar */}
            <div className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${showNotesSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="text-amber-800" size={20} />
                        <h3 className="font-sans font-black uppercase tracking-widest text-sm text-stone-800">Page {currentPage + 1} Annotations</h3>
                    </div>
                    <button onClick={() => setShowNotesSidebar(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
                    {currentPageNotes.length > 0 ? (
                        currentPageNotes.map(note => (
                            <div key={note.id} className="group bg-amber-50/30 p-5 rounded-2xl border border-amber-100/50 relative animate-slide-up">
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="absolute top-4 right-4 text-stone-300 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <p className="text-stone-800 leading-relaxed font-sans italic">"{note.text}"</p>
                                <div className="mt-3 text-[10px] font-sans font-black text-stone-400 uppercase tracking-widest">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <MessageSquare className="mx-auto text-stone-200 mb-4" size={48} />
                            <p className="text-stone-400 font-sans font-bold text-xs uppercase tracking-widest">No annotations for this page.</p>
                        </div>
                    )}
                </div>

                {username ? (
                    <form onSubmit={handleAddNote} className="p-6 bg-stone-50 border-t border-stone-100">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Share your thoughts on this section..."
                            className="w-full bg-white border border-stone-200 rounded-xl p-4 text-sm font-sans focus:ring-2 focus:ring-amber-500 outline-none transition-all min-h-[100px] resize-none"
                        />
                        <button
                            type="submit"
                            disabled={!newNote.trim() || submittingNote}
                            className="w-full mt-4 bg-amber-800 text-white font-sans font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-amber-900 transition-all shadow-lg shadow-amber-100 disabled:opacity-50"
                        >
                            {submittingNote ? 'Pining...' : 'Pin Note'}
                        </button>
                    </form>
                ) : (
                    <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
                        <Link to="/signin" className="inline-block w-full bg-stone-200 text-stone-800 font-sans font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-stone-300 transition-all">Sign In to Annotate</Link>
                    </div>
                )}
            </div>

            {/* Settings Sidebar */}
            <div className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <div className="flex items-center gap-3">
                        <Settings2 className="text-amber-800" size={20} />
                        <h3 className="font-sans font-black uppercase tracking-widest text-sm text-stone-800">Reading Experience</h3>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-12">
                    {/* Theme Picker */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                            <Palette size={14} /> Theme
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.keys(themes).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 capitalize font-sans text-xs font-bold ${theme === t ? 'border-amber-800 bg-amber-50 text-amber-900' : 'border-stone-100 bg-white text-stone-400 hover:border-stone-200'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border border-stone-200 ${t === 'dark' ? 'bg-[#121212]' : t === 'sepia' ? 'bg-[#f4ecd8]' : t === 'paper' ? 'bg-[#fcf8f0]' : 'bg-white'}`}></div>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                            <Type size={14} /> Typeface
                        </div>
                        <div className="flex flex-col gap-2">
                            {Object.keys(fontFamilies).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFontFamily(f)}
                                    className={`px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between font-sans text-sm font-bold ${fontFamily === f ? 'border-amber-800 bg-amber-50 text-amber-900 shadow-sm' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'
                                        }`}
                                >
                                    <span className={fontFamilies[f]}>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
                                    {fontFamily === f && <div className="w-2 h-2 rounded-full bg-amber-800"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                            <Monitor size={14} /> Text Size
                        </div>
                        <div className="bg-stone-50 p-2 rounded-2xl flex gap-1">
                            {['small', 'medium', 'large'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFontSize(s)}
                                    className={`flex-grow py-3 rounded-xl font-sans text-[10px] font-black uppercase tracking-widest transition-all ${fontSize === s ? 'bg-white text-amber-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-12 px-6">
                {/* Immersive Header */}
                <div className={`flex items-center justify-between mb-16 border-b pb-6 no-print animate-fade-in ${theme === 'dark' ? 'border-[#333]' : 'border-stone-200'}`}>
                    <Link to={`/book/${id}`} className={`flex items-center gap-2 transition-all group ${theme === 'dark' ? 'text-stone-500 hover:text-indigo-400' : 'text-stone-400 hover:text-amber-800'}`}>
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-sans font-bold">Library</span>
                    </Link>

                    <div className="flex items-center gap-12">
                        <div className="flex flex-col items-center gap-1">
                            <span className={`text-[10px] font-sans font-black uppercase tracking-[0.3em] mb-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`}>Chronicle</span>
                            <h2 className="text-sm font-sans font-bold text-center line-clamp-1 opacity-80">{book.title}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSettings(true)}
                            className={`p-2.5 rounded-xl border transition-all hover:shadow-md ${theme === 'dark'
                                ? 'bg-[#1a1a1a] border-[#333] text-stone-400 hover:text-white hover:border-indigo-500'
                                : 'bg-white border-stone-200 text-stone-600 hover:text-amber-800 hover:border-amber-800'
                                }`}
                        >
                            <Settings2 size={20} />
                        </button>
                        <button
                            onClick={() => setShowNotesSidebar(true)}
                            className={`relative p-2.5 rounded-xl border transition-all hover:shadow-md ${theme === 'dark'
                                ? 'bg-[#1a1a1a] border-[#333] text-stone-400 hover:text-white hover:border-indigo-500'
                                : 'bg-white border-stone-200 text-stone-600 hover:text-amber-800 hover:border-amber-800'
                                }`}
                        >
                            <MessageSquare size={20} />
                            {currentPageNotes.length > 0 && (
                                <span className={`absolute -top-2 -right-2 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 ${theme === 'dark' ? 'bg-indigo-600 text-white border-[#121212]' : 'bg-amber-800 text-white border-stone-50'}`}>
                                    {currentPageNotes.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* The Page */}
                <div className="relative group animate-slide-up">
                    <div className={`absolute inset-0 rounded-[2.5rem] translate-x-3 translate-y-3 -z-10 opacity-30 ${theme === 'dark' ? 'bg-indigo-900/20' : 'bg-stone-300'}`}></div>
                    <div className={`p-10 md:p-24 rounded-[2.5rem] border shadow-2xl min-h-[75vh] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${themes[theme]} ${theme === 'dark' ? 'border-[#333]' : 'border-stone-100'}`}>
                        {/* Spine Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-stone-100'}`}></div>

                        <div className="max-w-2xl w-full">
                            <p className={`leading-[1.7] first-letter:float-left first-letter:mr-4 first-letter:leading-none ${fontSizes[fontSize]} ${theme === 'dark'
                                ? 'first-letter:text-indigo-400 first-letter:text-8xl first-letter:font-black'
                                : 'first-letter:text-amber-900 first-letter:text-8xl first-letter:font-bold'
                                }`}>
                                {book.content[currentPage]}
                            </p>
                        </div>

                        {/* Pagination indicator dots */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {book.content.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentPage
                                        ? (theme === 'dark' ? 'bg-indigo-500 w-6' : 'bg-amber-800 w-6')
                                        : (theme === 'dark' ? 'bg-[#333] w-1.5' : 'bg-stone-200 w-1.5')
                                        }`}
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
                        className={`flex items-center gap-3 px-10 py-5 rounded-[1.5rem] font-sans font-black uppercase tracking-widest text-[10px] transition-all shadow-sm ${currentPage === 0
                            ? (theme === 'dark' ? 'text-stone-700 bg-[#1a1a1a]' : 'text-stone-300 bg-stone-100')
                            : (theme === 'dark' ? 'bg-[#1a1a1a] border border-[#333] text-stone-400 hover:text-indigo-400 hover:border-indigo-500' : 'text-stone-700 bg-white border border-stone-200 hover:border-amber-800 hover:text-amber-800 hover:shadow-md')
                            }`}
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <div className={`text-[10px] font-sans font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`}>
                        Verse {currentPage + 1} <span className="mx-4 opacity-30">|</span> {book.content.length}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === book.content.length - 1}
                        className={`flex items-center gap-3 px-10 py-5 rounded-[1.5rem] font-sans font-black uppercase tracking-widest text-[10px] transition-all shadow-sm ${currentPage === book.content.length - 1
                            ? (theme === 'dark' ? 'text-stone-700 bg-[#1a1a1a]' : 'text-stone-300 bg-stone-100')
                            : (theme === 'dark' ? 'bg-[#1a1a1a] border border-[#333] text-stone-400 hover:text-indigo-400 hover:border-indigo-500' : 'text-stone-700 bg-white border border-stone-200 hover:border-amber-800 hover:text-amber-800 hover:shadow-md')
                            }`}
                    >
                        Next
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Reading Progress Bar (Fixed Bottom) */}
            <div className={`fixed bottom-0 left-0 right-0 h-1.5 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-stone-200'}`}>
                <div
                    className={`h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${theme === 'dark' ? 'bg-indigo-600' : 'bg-amber-800'}`}
                    style={{ width: `${progressPerc}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Reader;
