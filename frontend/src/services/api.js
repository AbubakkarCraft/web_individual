import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
});

export const signup = (userData) => api.post('/auth/signup', userData);
export const signin = (credentials) => api.post('/auth/signin', credentials);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

// Book Service
export const getBooks = () => api.get('/books');
export const getBookById = (id) => api.get(`/books/${id}`);

// Comment Service
export const getComments = (bookId) => api.get(`/comments/${bookId}`);
export const postComment = (commentData) => {
    const token = localStorage.getItem('token');
    return api.post('/comments', commentData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateComment = (commentId, commentData) => {
    const token = localStorage.getItem('token');
    return api.put(`/comments/${commentId}`, commentData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteComment = (commentId) => {
    const token = localStorage.getItem('token');
    return api.delete(`/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Wishlist Service
export const getWishlist = () => {
    const token = localStorage.getItem('token');
    return api.get('/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const toggleWishlist = (bookId) => {
    const token = localStorage.getItem('token');
    return api.post('/wishlist/toggle', { bookId }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Note Service
export const getNotes = (bookId) => {
    const token = localStorage.getItem('token');
    return api.get(`/notes/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const postNote = (noteData) => {
    const token = localStorage.getItem('token');
    return api.post('/notes', noteData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteNote = (noteId) => {
    const token = localStorage.getItem('token');
    return api.delete(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getProfile = () => {
    const token = localStorage.getItem('token');
    return api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateProfile = (profileData) => {
    const token = localStorage.getItem('token');
    return api.put('/users/update', profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getProgress = (bookId) => {
    const token = localStorage.getItem('token');
    return api.get(`/progress/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateProgress = (bookId, currentPage) => {
    const token = localStorage.getItem('token');
    return api.post('/progress', { bookId, currentPage }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getAllProgress = () => {
    const token = localStorage.getItem('token');
    return api.get('/progress', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Rating Service
export const getBookRatings = (bookId) => {
    return api.get(`/ratings/book/${bookId}`);
};

export const getUserRating = (bookId) => {
    const token = localStorage.getItem('token');
    return api.get(`/ratings/user/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const submitRating = (bookId, score) => {
    const token = localStorage.getItem('token');
    return api.post('/ratings', { bookId, score }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Review Service
export const getAllReviews = () => api.get('/reviews');
export const getReviewsByBook = (bookId) => api.get(`/reviews/book/${bookId}`);
export const postReview = (reviewData) => {
    const token = localStorage.getItem('token');
    return api.post('/reviews', reviewData, { headers: { Authorization: `Bearer ${token}` } });
};
export const updateReview = (reviewId, reviewData) => {
    const token = localStorage.getItem('token');
    return api.put(`/reviews/${reviewId}`, reviewData, { headers: { Authorization: `Bearer ${token}` } });
};
export const deleteReview = (reviewId) => {
    const token = localStorage.getItem('token');
    return api.delete(`/reviews/${reviewId}`, { headers: { Authorization: `Bearer ${token}` } });
};

export default api;
