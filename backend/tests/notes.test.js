const request = require('supertest');
const app = require('../index');

/**
 * Notes CRUD Tests
 * 
 * These tests cover the full lifecycle of a note:
 * - Create a note
 * - Read notes for a book
 * - Delete a note
 */

describe('Notes API', () => {
    let token;
    let bookId;
    let noteId;
    const testUser = {
        email: `test_notes_${Date.now()}@example.com`,
        password: 'password123',
        username: 'notetaker_' + Date.now()
    };

    beforeAll(async () => {
        await request(app).post('/api/auth/signup').send(testUser);
        const loginRes = await request(app).post('/api/auth/signin').send({
            email: testUser.email,
            password: testUser.password
        });
        token = loginRes.body.token;

        const booksRes = await request(app).get('/api/books');
        if (booksRes.body.length > 0) {
            bookId = booksRes.body[0].id;
        }
    });

    describe('POST /api/notes', () => {
        it('should create a new note', async () => {
            if (!bookId) return;

            const res = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    bookId: bookId,
                    text: 'This is a test note.',
                    currentPage: 10
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('text', 'This is a test note.');
            expect(res.body).toHaveProperty('id');
            noteId = res.body.id;
        });
    });

    describe('GET /api/notes/:bookId', () => {
        it('should fetch notes for a book', async () => {
            if (!bookId) return;

            const res = await request(app)
                .get(`/api/notes/${bookId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some(n => n.id === noteId)).toBe(true);
        });
    });

    describe('DELETE /api/notes/:id', () => {
        it('should delete a note', async () => {
            if (!noteId) return;

            const res = await request(app)
                .delete(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Note deleted successfully');
        });
    });
});
