import app from '@/app';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ApiResponse } from '@/types';
import Post from '@/database/models/post.model';

describe('Posts', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('POST /api/v1/posts', () => {
    it('should not create a post, when data is invalid', async () => {
      const { statusCode } = await supertest(app).post('/api/v1/posts').send({});
      expect(statusCode).toBe(422);
    });
    it('should create a post and return it', async () => {
      const { body, statusCode } = await supertest(app).post('/api/v1/posts').send({
        title: 'This is my post title',
        content: 'This is my very interesting post content',
      });
      const { data } = body as ApiResponse;
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('data');
      expect(data).toHaveProperty('_id');
    });
  });

  describe('GET /api/v1/posts', () => {
    it('should get all posts with pagination', async () => {
      await Post.factory(11).create();
      const { body, statusCode } = await supertest(app).get('/api/v1/posts');
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('meta');
      expect(body.meta.totalPage).toBe(2);
    });
  });

  describe('GET /api/v1/posts/:id', () => {
    it('should return 404, when post id does not exist', async () => {
      const postId = '61caa550d490fd1922bf1339';
      const { statusCode } = await supertest(app).get(`/api/v1/posts/${postId}`);
      expect(statusCode).toBe(404);
    });

    it('should return a post, when post id exists', async () => {
      const post = await Post.factory().createOne();
      const { statusCode } = await supertest(app).get(`/api/v1/posts/${post.id}`);
      expect(statusCode).toBe(200);
    });
  });

  describe('PUT /api/v1/posts/:id', () => {
    it('should update post and return updated post', async () => {
      const post = await Post.factory().createOne();
      const { body, statusCode } = await supertest(app).put(`/api/v1/posts/${post.id}`).send({
        title: 'My updated post title',
        content: 'This is a test description for this post',
      });
      const { data } = body as ApiResponse;
      expect(statusCode).toBe(200);
      expect(data.id).toBe(post.id);
      expect(data.title).toBe('My updated post title');
    });
  });

  describe('DELETE /api/v1/posts/:id', () => {
    it('should return 404, when post id does not exist', async () => {
      const postId = '61caa550d490fd1922bf1339';
      const { statusCode } = await supertest(app).delete(`/api/v1/posts/${postId}`);
      expect(statusCode).toBe(404);
    });

    it('should delete post, when post id exists', async () => {
      const post = await Post.factory().createOne();
      const { statusCode } = await supertest(app).delete(`/api/v1/posts/${post.id}`);
      expect(statusCode).toBe(200);
    });
  });
});
