const request = require('supertest');
const app = require('../index');

/**
 * Ratings API Tests
 * 
 * These tests cover:
 * - Submitting a rating for a book
 * - Fetching a user's rating for a specific book
 * - Fetching all ratings for a book
 */

describe('Ratings API', () => {
    let token;
    let bookId;
    const testUser = {
        email: `test_ratings_${Date.now()}@example.com`,
        password: 'password123',
        username: 'rater_' + Date.now()
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

    describe('POST /api/ratings', () => {
        it('should submit a rating for a book', async () => {
            if (!bookId) return;

            const res = await request(app)
                .post('/api/ratings')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    bookId: bookId,
                    score: 5
                });

            expect([200, 201]).toContain(res.statusCode);
            expect(res.body.rating).toHaveProperty('score', 5);
        });
    });

    describe('GET /api/ratings/user/:bookId', () => {
        it('should fetch the user rating for a book', async () => {
            if (!bookId) return;

            const res = await request(app)
                .get(`/api/ratings/user/${bookId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('score', 5);
        });
    });

    describe('GET /api/ratings/book/:bookId', () => {
        it('should fetch all ratings for a book', async () => {
            if (!bookId) return;

            const res = await request(app).get(`/api/ratings/book/${bookId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('averageRating');
            expect(res.body).toHaveProperty('ratingCount');
        });
    });
});
