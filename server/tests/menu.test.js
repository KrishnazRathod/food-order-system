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

beforeAll(async () => {
  app = express();
  app.set('port', 0);
  // eslint-disable-next-line no-new
  new Bootstrap(app);
  server = http.createServer(app);

  await models.sequelize.sync({ force: true });

  // Create admin role and user
  const adminRole = await models.role.create({ role: 'admin', description: 'Admin user' });
  const userRole = await models.role.create({ role: 'user', description: 'Regular user' });

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
  await models.userRole.create({ userId: regularUser.id, roleId: userRole.id });

  // Login to get tokens
  const adminLogin = await request(server)
    .post('/api/account/login')
    .send({ email: 'admin@test.com', password: 'Admin@123' });
  adminToken = adminLogin.body.data.token;

  const userLogin = await request(server)
    .post('/api/account/login')
    .send({ email: 'user@test.com', password: 'Admin@123' });
  userToken = userLogin.body.data.token;
});

afterAll(async () => {
  await models.sequelize.close();
  if (server) server.close();
});

describe('Menu API', () => {
  let menuItemId;

  describe('POST /api/menu', () => {
    it('should create a menu item (admin)', async () => {
      const res = await request(server)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Pizza',
          description: 'A delicious test pizza',
          price: 12.99,
          category: 'pizza',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Pizza');
      menuItemId = res.body.data.id;
    });

    it('should reject if user is not admin', async () => {
      const res = await request(server)
        .post('/api/menu')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Pizza',
          price: 9.99,
          category: 'pizza',
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject with invalid data', async () => {
      const res = await request(server)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'A',
          price: -5,
        });
      expect(res.status).toBe(400);
    });

    it('should create a second menu item for testing', async () => {
      const res = await request(server)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Burger',
          description: 'A juicy test burger',
          price: 11.49,
          category: 'burger',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Test Burger');
    });
  });

  describe('GET /api/menu', () => {
    it('should list all menu items', async () => {
      const res = await request(server).get('/api/menu');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBeGreaterThanOrEqual(2);
    });

    it('should filter by category', async () => {
      const res = await request(server).get('/api/menu?category=pizza');
      expect(res.status).toBe(200);
      res.body.data.rows.forEach((item) => {
        expect(item.category).toBe('pizza');
      });
    });

    it('should search by name', async () => {
      const res = await request(server).get('/api/menu?search=Pizza');
      expect(res.status).toBe(200);
      expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item', async () => {
      const res = await request(server).get(`/api/menu/${menuItemId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(menuItemId);
    });

    it('should return 404 for non-existent item', async () => {
      const res = await request(server).get('/api/menu/99999');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/menu/:id', () => {
    it('should update a menu item (admin)', async () => {
      const res = await request(server)
        .put(`/api/menu/${menuItemId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 14.99 });
      expect(res.status).toBe(200);
      expect(parseFloat(res.body.data.price)).toBe(14.99);
    });
  });

  describe('DELETE /api/menu/:id', () => {
    it('should soft-delete a menu item (admin)', async () => {
      const res = await request(server)
        .delete(`/api/menu/${menuItemId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.isAvailable).toBe(false);
    });
  });
});
