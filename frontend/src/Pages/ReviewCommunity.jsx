import { useEffect, useState } from 'react';
import { getAllReviews, postReview, updateReview, deleteReview } from '../services/api';
import toast from 'react-hot-toast';

const ReviewCommunity = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [recommend, setRecommend] = useState(true);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [editRecommend, setEditRecommend] = useState(true);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getAllReviews();
                setReviews(res.data);
            } catch (err) {
                console.error('Failed to load reviews', err);
                toast.error('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('token')) {
            toast.error('Sign in to post a review');
            return;
        }
        if (!content.trim()) return;
        try {
            const { data } = await postReview({ title, content, rating, recommend });
            setReviews([data, ...reviews]);
            setTitle(''); setContent(''); setRating(0); setRecommend(true);
            toast.success('Review posted');
        } catch (err) {
            console.error(err);
            toast.error('Failed to post review');
        }
    };

    const startEdit = (r) => {
        setEditingId(r.id);
        setEditTitle(r.title || '');
        setEditContent(r.content || '');
        setEditRating(r.rating || 0);
        setEditRecommend(Boolean(r.recommend));
    };

    const handleUpdate = async (id) => {
        if (!editContent.trim()) return;
        try {
            const { data } = await updateReview(id, { title: editTitle, content: editContent, rating: editRating, recommend: editRecommend });
            setReviews(reviews.map(r => r.id === id ? data : r));
            setEditingId(null);
            toast.success('Review updated');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update review');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await deleteReview(id);
            setReviews(reviews.filter(r => r.id !== id));
            toast.success('Review deleted');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete review');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Review Community</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Share your reads, recommend favorites, and help others discover great books.</p>

                <div className="mb-10 bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-gray-100 dark:border-[#21262d]">
                    {username ? (
                        <form onSubmit={handleSubmit}>
                            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (optional)" className="w-full mb-3 p-3 rounded-lg border" />
                            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Write your review..." className="w-full mb-3 p-3 rounded-lg border min-h-[120px]" />
                            <div className="flex items-center gap-4 mb-3">
                                <label className="flex items-center gap-2">
                                    <span>Rating</span>
                                    <input type="number" value={rating} onChange={e=>setRating(Number(e.target.value))} min={0} max={5} className="w-16 p-2 border rounded" />
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={recommend} onChange={e=>setRecommend(e.target.checked)} /> Recommend
                                </label>
                            </div>
                            <div>
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Post Review</button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8">Sign in to post reviews.</div>
                    )}
                </div>

                <div className="space-y-6">
                    {loading ? <div>Loading...</div> : (
                        reviews.length === 0 ? <div className="text-gray-500">No reviews yet.</div> : reviews.map(r => (
                            <div key={r.id} className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-gray-100 dark:border-[#21262d]">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-black text-sm">{r.user?.username || 'Reader'}</div>
                                        <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        {r.rating ? <div className="text-sm font-bold">{r.rating}/5</div> : null}
                                        {r.recommend ? <div className="text-xs text-emerald-600">Recommended</div> : <div className="text-xs text-gray-400">Not recommended</div>}
                                    </div>
                                </div>

                                {/* Author controls */}
                                {username === r.user?.username && (
                                    <div className="flex gap-2 mt-3 justify-end">
                                        {editingId === r.id ? (
                                            <>
                                                <button onClick={() => handleUpdate(r.id)} className="px-3 py-1 bg-emerald-600 text-white rounded">Save</button>
                                                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Cancel</button>
                                                <button onClick={() => handleDelete(r.id)} className="px-3 py-1 bg-rose-500 text-white rounded">Delete</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(r)} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit</button>
                                                <button onClick={() => handleDelete(r.id)} className="px-3 py-1 bg-rose-500 text-white rounded">Delete</button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {editingId === r.id ? (
                                    <div className="mt-4 space-y-2">
                                        <input className="w-full p-2 border rounded" value={editTitle} onChange={e=>setEditTitle(e.target.value)} placeholder="Title (optional)" />
                                        <textarea className="w-full p-2 border rounded" value={editContent} onChange={e=>setEditContent(e.target.value)} rows={4} />
                                        <div className="flex items-center gap-3">
                                            <input type="number" min={0} max={5} className="w-20 p-2 border rounded" value={editRating} onChange={e=>setEditRating(Number(e.target.value))} />
                                            <label className="flex items-center gap-2"><input type="checkbox" checked={editRecommend} onChange={e=>setEditRecommend(e.target.checked)} /> Recommend</label>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {r.title && <h3 className="mt-4 font-bold text-lg">{r.title}</h3>}
                                        <p className="mt-2 text-gray-700 dark:text-gray-300">{r.content}</p>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCommunity;
