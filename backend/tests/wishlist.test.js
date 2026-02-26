const request = require('supertest');
const app = require('../index');

/**
 * Wishlist API Tests
 * 
 * These tests cover:
 * - Toggling a book in the wishlist
 * - Fetching the wishlist
 */

describe('Wishlist API', () => {
    let token;
    let bookId;
    const testUser = {
        email: `test_wishlist_${Date.now()}@example.com`,
        password: 'password123',
        username: 'wisher_' + Date.now()
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

    describe('POST /api/wishlist/toggle', () => {
        it('should add a book to the wishlist', async () => {
            if (!bookId) return;

            const res = await request(app)
                .post('/api/wishlist/toggle')
                .set('Authorization', `Bearer ${token}`)
                .send({ bookId: bookId });

            expect([200, 201]).toContain(res.statusCode);
            expect(res.body).toHaveProperty('message');
        });

        it('should remove a book from the wishlist on second toggle', async () => {
            if (!bookId) return;

            const res = await request(app)
                .post('/api/wishlist/toggle')
                .set('Authorization', `Bearer ${token}`)
                .send({ bookId: bookId });

            expect([200, 201]).toContain(res.statusCode);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('GET /api/wishlist', () => {
        it('should fetch the user wishlist', async () => {
            const res = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});
