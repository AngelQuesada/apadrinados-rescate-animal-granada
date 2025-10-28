import request from 'supertest';
import app from '../app.js'; // Import the app instance
import sponsorsData from '../mocks/sponsors.json';

describe('WordPress Endpoints', () => {
  // The test script in package.json already handles resetting the DB
  // so we can rely on the seed data being present for each test run.

  describe('GET /api/wordpress/get-all-sponsors', () => {
    it('should return all sponsors from the database', async () => {
      const response = await request(app)
        .get('/api/wordpress/get-all-sponsors')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.count).toBe(sponsorsData.sponsors.length);
      expect(Array.isArray(response.body.sponsors)).toBe(true);

      // Check if the response contains the first sponsor from the mock data
      // The order from the DB might not be guaranteed, so we use expect.arrayContaining
      expect(response.body.sponsors).toEqual(
        expect.arrayContaining([
          expect.objectContaining(sponsorsData.sponsors[0]),
        ])
      );
    });
  });
});
