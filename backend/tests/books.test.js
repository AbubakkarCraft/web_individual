const request = require('supertest');
const app = require('../index');

/**
 * Books API Tests
 * 
 * These tests cover the retrieval of book listings and individual book details.
 */

describe('Books API', () => {
    let bookId;

    describe('GET /api/books', () => {
        it('should fetch all books successfully', async () => {
            const res = await request(app).get('/api/books');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            if (res.body.length > 0) {
                bookId = res.body[0].id;
                expect(res.body[0]).toHaveProperty('title');
                expect(res.body[0]).toHaveProperty('averageRating');
            }
        });
    });

    describe('GET /api/books/:id', () => {
        it('should fetch book details successfully', async () => {
            if (!bookId) return; // Skip if no book found

            const res = await request(app).get(`/api/books/${bookId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', bookId);
            expect(res.body).toHaveProperty('title');
            expect(res.body).toHaveProperty('description');
        });

        it('should return 404 for non-existent book', async () => {
            const res = await request(app).get('/api/books/00000000-0000-0000-0000-000000000000');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Book not found');
        });
    });
});
