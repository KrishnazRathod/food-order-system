import request from 'supertest';
import http from 'http';
import express from 'express';
import Bootstrap from '../src/app';
import models from '../src/models';
import utility from '../src/services/utility';

let app;
let server;
let adminToken;
let userToken;
let menuItemId1;
let menuItemId2;
let orderId;

beforeAll(async () => {
  app = express();
  app.set('port', 0);
  // eslint-disable-next-line no-new
  new Bootstrap(app);
  server = http.createServer(app);

  await models.sequelize.sync({ force: true });

  // Create roles and users
  const adminRole = await models.role.create({ role: 'admin', description: 'Admin user' });
  const userRoleRecord = await models.role.create({ role: 'user', description: 'Regular user' });

  const hashedPassword = await utility.generateHashPassword('Admin@123');
  const admin = await models.user.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: hashedPassword,
    status: 'active',
  });
  await models.userRole.create({ userId: admin.id, roleId: adminRole.id });

  const regularUser = await models.user.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'user@test.com',
    password: hashedPassword,
    status: 'active',
  });
  await models.userRole.create({ userId: regularUser.id, roleId: userRoleRecord.id });

  // Login
  const adminLogin = await request(server)
    .post('/api/account/login')
    .send({ email: 'admin@test.com', password: 'Admin@123' });
  adminToken = adminLogin.body.data.token;

  const userLogin = await request(server)
    .post('/api/account/login')
    .send({ email: 'user@test.com', password: 'Admin@123' });
  userToken = userLogin.body.data.token;

  // Create menu items
  const item1 = await models.menuItem.create({
    name: 'Order Test Pizza',
    price: 12.99,
    category: 'pizza',
    isAvailable: true,
  });
  menuItemId1 = item1.id;

  const item2 = await models.menuItem.create({
    name: 'Order Test Burger',
    price: 10.99,
    category: 'burger',
    isAvailable: true,
  });
  menuItemId2 = item2.id;
});

afterAll(async () => {
  await models.sequelize.close();
  if (server) server.close();
});

describe('Order API', () => {
  describe('POST /api/order', () => {
    it('should place an order with valid data', async () => {
      const res = await request(server)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [
            { menuItemId: menuItemId1, quantity: 2 },
            { menuItemId: menuItemId2, quantity: 1 },
          ],
          deliveryName: 'John Doe',
          deliveryAddress: '123 Main St, City',
          deliveryPhone: '1234567890',
          notes: 'Ring doorbell',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('received');
      expect(parseFloat(res.body.data.totalAmount)).toBe(36.97);
      orderId = res.body.data.id;
    });

    it('should reject order with empty items', async () => {
      const res = await request(server)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [],
          deliveryName: 'John Doe',
          deliveryAddress: '123 Main St',
          deliveryPhone: '1234567890',
        });
      expect(res.status).toBe(400);
    });

    it('should reject order without delivery info', async () => {
      const res = await request(server)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ menuItemId: menuItemId1, quantity: 1 }],
        });
      expect(res.status).toBe(400);
    });

    it('should reject order without authentication', async () => {
      const res = await request(server)
        .post('/api/order')
        .send({
          items: [{ menuItemId: menuItemId1, quantity: 1 }],
          deliveryName: 'John',
          deliveryAddress: '123 St',
          deliveryPhone: '1234567890',
        });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/order', () => {
    it('should return user orders', async () => {
      const res = await request(server)
        .get('/api/order')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBeGreaterThanOrEqual(1);
    });

    it('should return all orders for admin', async () => {
      const res = await request(server)
        .get('/api/order')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/order/:id', () => {
    it('should return order detail with items', async () => {
      const res = await request(server)
        .get(`/api/order/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.orderItems.length).toBe(2);
    });
  });

  describe('PATCH /api/order/:id/status', () => {
    it('should update order status (admin)', async () => {
      const res = await request(server)
        .patch(`/api/order/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'preparing' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('preparing');
    });

    it('should reject status update by regular user', async () => {
      const res = await request(server)
        .patch(`/api/order/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'delivered' });
      expect(res.status).toBe(400);
    });

    it('should reject invalid status', async () => {
      const res = await request(server)
        .patch(`/api/order/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid_status' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/order/:id', () => {
    it('should cancel an order (admin)', async () => {
      // Create a new order to cancel
      const orderRes = await request(server)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ menuItemId: menuItemId1, quantity: 1 }],
          deliveryName: 'Cancel Test',
          deliveryAddress: '456 Cancel St',
          deliveryPhone: '9876543210',
        });
      const cancelOrderId = orderRes.body.data.id;

      const res = await request(server)
        .delete(`/api/order/${cancelOrderId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('cancelled');
    });
  });
});
