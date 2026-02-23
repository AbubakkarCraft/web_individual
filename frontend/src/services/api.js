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

export default api;
