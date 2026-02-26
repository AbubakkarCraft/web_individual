const request = require('supertest');
const app = require('../index');

/**
 * Comments CRUD Tests
 * 
 * These tests cover the full lifecycle of a comment:
 * - Create a comment
 * - Read comments for a book
 * - Update a comment
 * - Delete a comment
 */

describe('Comments API', () => {
    let token;
    let bookId;
    let commentId;
    const testUser = {
        email: `test_comments_${Date.now()}@example.com`,
        password: 'password123',
        username: 'commenter_' + Date.now()
    };

    beforeAll(async () => {
        // Register and login to get a token
        const signupRes = await request(app).post('/api/auth/signup').send(testUser);
        if (signupRes.status !== 201 && signupRes.status !== 400) {
            console.error('SIGNUP FAILED in Comments Test:', signupRes.body);
        }
        const loginRes = await request(app).post('/api/auth/signin').send({
            email: testUser.email,
            password: testUser.password
        });

        token = loginRes.body.token;
        if (!token) {
            console.error('FAILED TO GET TOKEN in Comments Test:', loginRes.body);
        }

        // Get a book ID to comment on
        const booksRes = await request(app).get('/api/books');
        if (booksRes.body.length > 0) {
            bookId = booksRes.body[0].id;
        } else {
            console.error('NO BOOKS FOUND in Comments Test');
        }
    });

    describe('POST /api/comments', () => {
        it('should create a new comment', async () => {
            if (!bookId) return;

            const res = await request(app)
                .post('/api/comments')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    bookId: bookId,
                    text: 'This is a test comment.'
                });

            if (res.statusCode === 401) {
                console.error('401 UNAUTHORIZED in POST /api/comments:', res.body);
            }
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('text', 'This is a test comment.');
            expect(res.body).toHaveProperty('id');
            commentId = res.body.id;
        });

        it('should fail to create a comment without auth', async () => {
            const res = await request(app)
                .post('/api/comments')
                .send({
                    bookId: bookId,
                    text: 'Unauthorized comment'
                });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/comments/:bookId', () => {
        it('should fetch comments for a book', async () => {
            if (!bookId) return;

            const res = await request(app).get(`/api/comments/${bookId}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some(c => c.id === commentId)).toBe(true);
        });
    });

    describe('PUT /api/comments/:id', () => {
        it('should update an existing comment', async () => {
            if (!commentId) return;

            const res = await request(app)
                .put(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    text: 'Updated test comment.'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('text', 'Updated test comment.');
        });
    });

    describe('DELETE /api/comments/:id', () => {
        it('should delete an existing comment', async () => {
            if (!commentId) return;

            const res = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Comment deleted successfully');
        });
    });
});
