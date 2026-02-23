import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile, getAllProgress } from '../services/api';
import toast from 'react-hot-toast';
import {
    User as UserIcon, Mail, BookOpen, Heart, Notebook, MessageSquare,
    Edit3, Save, X, Camera, Play, Clock
} from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [recentProgress, setRecentProgress] = useState([]);
    const [editData, setEditData] = useState({
        username: '',
        bio: '',
        avatarUrl: ''
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profileRes, progressRes] = await Promise.all([
                    getProfile(),
                    getAllProgress()
                ]);

                setProfile(profileRes.data);
                setRecentProgress(progressRes.data);
                setEditData({
                    username: profileRes.data.user.username,
                    bio: profileRes.data.user.bio || '',
                    avatarUrl: profileRes.data.user.avatarUrl || ''
                });
            } catch (err) {
                toast.error('Failed to load profile');
                if (err.response?.status === 401) navigate('/signin');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(editData);
            setProfile({
                ...profile,
                user: { ...profile.user, ...editData }
            });
            localStorage.setItem('username', editData.username);
            setIsEditing(false);
            toast.success('Identity updated!');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-[#0f1115] gap-4 transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
                <p className="text-stone-400 dark:text-stone-500 font-sans font-black uppercase tracking-[0.3em] text-[10px]">Loading Sanctuary...</p>
            </div>
        );
    }

    const { user, stats } = profile;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] py-12 px-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white dark:bg-[#161b22] rounded-[3rem] shadow-sm border border-gray-100 dark:border-[#21262d] overflow-hidden mb-12 animate-fade-in">
                    <div className="h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 relative">
                        <div className="absolute -bottom-16 left-12">
                            <div className="relative group">
                                <div className="w-36 h-36 rounded-[2.5rem] bg-white dark:bg-[#161b22] p-1.5 shadow-2xl border dark:border-[#30363d]">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover rounded-[2.2rem]" />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-50 dark:bg-indigo-950/30 rounded-[2.2rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <UserIcon size={56} />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                        <Camera size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-24 px-12 pb-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-3 uppercase">{user.username}</h1>
                                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                    <Mail size={16} className="text-indigo-400 dark:text-indigo-500" />
                                    {user.email}
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${isEditing
                                    ? 'bg-gray-100 dark:bg-[#21262d] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#30363d]'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none animate-pulse-subtle'
                                    }`}
                            >
                                {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Refine Identity</>}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-8 animate-slide-up">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Username</label>
                                        <input
                                            type="text"
                                            value={editData.username}
                                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-[#0f1115] border-2 border-transparent dark:border-[#21262d] rounded-[1.5rem] p-5 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950/20 focus:border-indigo-100 dark:focus:border-indigo-900 outline-none transition-all font-bold dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Avatar URL</label>
                                        <input
                                            type="text"
                                            value={editData.avatarUrl}
                                            onChange={(e) => setEditData({ ...editData, avatarUrl: e.target.value })}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full bg-gray-50 dark:bg-[#0f1115] border-2 border-transparent dark:border-[#21262d] rounded-[1.5rem] p-5 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950/20 focus:border-indigo-100 dark:focus:border-indigo-900 outline-none transition-all font-bold dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Reader Biography</label>
                                    <textarea
                                        value={editData.bio}
                                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                        placeholder="Every reader contains multitudes. Tell us yours..."
                                        className="w-full bg-gray-50 dark:bg-[#0f1115] border-2 border-transparent dark:border-[#21262d] rounded-[1.5rem] p-5 min-h-[160px] focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950/20 focus:border-indigo-100 dark:focus:border-indigo-900 outline-none transition-all font-bold resize-none dark:text-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gray-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] py-6 px-12 rounded-[1.5rem] hover:bg-black dark:hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-2xl shadow-indigo-100 dark:shadow-none"
                                >
                                    <Save size={18} />
                                    Preserve Identity
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-16 animate-fade-in">
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-6">Chronicles of the Reader</h3>
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-xl font-bold italic font-serif">
                                        {user.bio || "In the silence between pages, this story is yet to be written..."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[2rem] border border-gray-100 dark:border-[#21262d] shadow-sm group hover:bg-rose-500 transition-all duration-700">
                                        <div className="bg-rose-50 dark:bg-rose-950/30 w-14 h-14 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm mb-6 group-hover:scale-110 group-hover:bg-white transition-all">
                                            <Heart size={28} fill="currentColor" />
                                        </div>
                                        <div className="text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-white transition-colors">{stats.wishlistCount}</div>
                                        <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-rose-100 transition-colors">Wishlist Sanctuary</div>
                                    </div>

                                    <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[2rem] border border-gray-100 dark:border-[#21262d] shadow-sm group hover:bg-amber-500 transition-all duration-700">
                                        <div className="bg-amber-50 dark:bg-amber-950/30 w-14 h-14 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm mb-6 group-hover:scale-110 group-hover:bg-white transition-all">
                                            <Notebook size={28} />
                                        </div>
                                        <div className="text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-white transition-colors">{stats.notesCount}</div>
                                        <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-amber-100 transition-colors">Personal Verses</div>
                                    </div>

                                    <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[2rem] border border-gray-100 dark:border-[#21262d] shadow-sm group hover:bg-indigo-600 transition-all duration-700">
                                        <div className="bg-indigo-50 dark:bg-indigo-950/30 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6 group-hover:scale-110 group-hover:bg-white transition-all">
                                            <MessageSquare size={28} />
                                        </div>
                                        <div className="text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-white transition-colors">{stats.commentsCount}</div>
                                        <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-indigo-100 transition-colors">Shared Echoes</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resume Reading List */}
                {recentProgress.length > 0 && !isEditing && (
                    <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-gray-400 dark:text-gray-500" size={18} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">Continue Your Journeys</h3>
                        </div>
                        <div className="space-y-4">
                            {recentProgress.map(progress => (
                                <Link
                                    key={progress.id}
                                    to={`/read/${progress.book.id}`}
                                    className="flex items-center gap-6 bg-white dark:bg-[#161b22] p-6 rounded-[2rem] border border-gray-100 dark:border-[#21262d] group transition-all hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900"
                                >
                                    <div className="w-16 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                                        <img src={progress.book.coverImage} alt={progress.book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{progress.book.title}</h4>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 italic">Page {progress.currentPage + 1}</p>
                                        <div className="w-full h-1 bg-gray-50 dark:bg-[#0f1115] rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${((progress.currentPage + 1) / 10) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-[#21262d] p-4 rounded-2xl text-gray-400 dark:text-gray-500 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Play size={20} fill="currentColor" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white dark:bg-[#161b22] p-10 rounded-[2.5rem] border border-gray-100 dark:border-[#21262d] shadow-sm flex items-center gap-8 group hover:border-indigo-600 dark:hover:border-indigo-900 transition-all cursor-pointer">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <BookOpen size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1">Active Wisdom</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium italic text-sm line-clamp-1">Manage your bookshelf</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#161b22] p-10 rounded-[2.5rem] border border-gray-100 dark:border-[#21262d] shadow-sm flex items-center gap-8 group hover:border-indigo-600 dark:hover:border-indigo-900 transition-all cursor-pointer">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <Save size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1">Sanctuary Settings</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium italic text-sm line-clamp-1">Theme & Text preferences</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
