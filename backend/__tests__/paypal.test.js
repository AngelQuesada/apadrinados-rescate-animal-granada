
import request from 'supertest';
import app from '../app.js';
import getPaypalInstance from '../services/paypalServices.js';

// Mock the paypalServices module
jest.mock('../services/paypalServices.js');

describe('PayPal Endpoints', () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
  describe('GET /api/paypal/get-subcriptions-plans/', () => {
    it('should return all subscription plans', async () => {
      const mockPlans = {
        plans: [
          { id: 'P-123', name: 'Basic Plan' },
          { id: 'P-456', name: 'Premium Plan' },
        ],
      };
      
      // Configure the mock to return the mock data
      getPaypalInstance.mockResolvedValue({
        fetchSubscriptions: jest.fn().mockResolvedValue(mockPlans),
      });

      const response = await request(app)
        .get('/api/paypal/get-subcriptions-plans/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockPlans.plans);
    });

    it('should handle errors when fetching subscription plans', async () => {
      // Configure the mock to throw an error
      getPaypalInstance.mockResolvedValue({
        fetchSubscriptions: jest.fn().mockRejectedValue(new Error('PayPal API Error')),
      });

      const response = await request(app)
        .get('/api/paypal/get-subcriptions-plans/')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.message).toContain('PayPal API Error');
    });
  });

  describe('GET /api/paypal/get-subcriptions-plans-ids/', () => {
    it('should return all subscription plan IDs', async () => {
      const mockPlans = {
        plans: [
          { id: 'P-123', name: 'Basic Plan' },
          { id: 'P-456', name: 'Premium Plan' },
        ],
      };
      getPaypalInstance.mockResolvedValue({
        fetchSubscriptions: jest.fn().mockResolvedValue(mockPlans),
      });

      const response = await request(app)
        .get('/api/paypal/get-subcriptions-plans-ids/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(['P-123', 'P-456']);
    });

    it('should handle errors when fetching subscription plan IDs', async () => {
      getPaypalInstance.mockResolvedValue({
        fetchSubscriptions: jest.fn().mockRejectedValue(new Error('PayPal API Error')),
      });

      const response = await request(app)
        .get('/api/paypal/get-subcriptions-plans-ids/')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.message).toContain('PayPal API Error');
    });
  });

  describe('GET /api/paypal/get-subscribers-from-all-subcriptions-plans/', () => {
    it('should return subscribers from all plans', async () => {
      const mockPlans = {
        plans: [{ id: 'P-123' }, { id: 'P-456' }],
      };
      const mockSubscribers = [{ email: 'test@example.com' }];
      getPaypalInstance.mockResolvedValue({
        fetchSubscriptions: jest.fn().mockResolvedValue(mockPlans),
        fetchSubscribersFromSubscriptionsPlans: jest.fn().mockResolvedValue(mockSubscribers),
      });

      const response = await request(app)
        .get('/api/paypal/get-subscribers-from-all-subcriptions-plans/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockSubscribers);
    });
  });

  describe('GET /api/paypal/get-subscribers-from-subscriptions-plans/:plansIds', () => {
    it('should return subscribers from specified plan IDs', async () => {
      const mockSubscribers = [{ email: 'test2@example.com' }];
      const plansIds = 'P-123,P-456';
      getPaypalInstance.mockResolvedValue({
        fetchSubscribersFromSubscriptionsPlans: jest.fn().mockResolvedValue(mockSubscribers),
      });

      const response = await request(app)
        .get(`/api/paypal/get-subscribers-from-subscriptions-plans/${plansIds}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockSubscribers);
      const serviceInstance = await getPaypalInstance();
      expect(serviceInstance.fetchSubscribersFromSubscriptionsPlans).toHaveBeenCalledWith(['P-123', 'P-456']);
    });
  });
});
