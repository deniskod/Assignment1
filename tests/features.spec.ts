/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Express } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { config } from '../src/config.js';
import { Server } from '../src/express/server.js';
import { Post } from '../src/express/posts/interface.js';

const { mongo } = config;

const fakeObjectId = '111111111111111111111111';

const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection!.deleteMany({});
    }
};

const examplePost: Post = {
    data: 'hello there',
    senderId: '123',
};

describe('e2e posts api testing', () => {
    let app: Express;

    beforeAll(async () => {
        await mongoose.connect(mongo.uri);
        app = Server.createExpressApp();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await removeAllCollections();
    });

    describe('/isAlive', () => {
        it('should return alive', async () => {
            const response = await request(app).get('/isAlive').expect(200);
            expect(response.text).toBe('alive');
        });
    });

    describe('/unknownRoute', () => {
        it('should return status code 404', async () => {
            return request(app).get('/unknownRoute').expect(404);
        });
    });

    describe('/api/posts', () => {
        describe('GET /api/posts', () => {
            it('should get all the posts', async () => {
                const posts: Post[] = [];

                for (let i = 0; i < 3; i++) {
                    const { body: post } = await request(app).post('/api/posts').send(examplePost).expect(200);

                    posts.push(post);
                }

                const { body } = await request(app).get('/api/posts').expect(200);

                expect(body).toEqual(posts);
            });

            it('should get posts with pagination', async () => {
                const posts: Post[] = [];

                for (let i = 0; i < 15; i++) {
                    const { body: post } = await request(app).post('/api/posts').send(examplePost).expect(200);

                    posts.push(post);
                }

                const [{ body: body1 }, { body: body2 }, { body: body3 }] = await Promise.all([
                    request(app).get('/api/posts').query({ limit: 5, step: 0 }).expect(200),
                    request(app).get('/api/posts').query({ limit: 5, step: 1 }).expect(200),
                    request(app).get('/api/posts').query({ limit: 5, step: 2 }).expect(200),
                ]);

                expect(body1).toEqual(posts.slice(0, 5));
                expect(body2).toEqual(posts.slice(5, 10));
                expect(body3).toEqual(posts.slice(10, 15));
            });

            it('should get an empty array', async () => {
                const { body } = await request(app).get('/api/posts').query({ limit: 100 }).expect(200);

                expect(body).toEqual([]);
            });
        });

        describe('GET /api/posts/:id', () => {
            it('should get a post', async () => {
                const { body: post } = await request(app).post('/api/posts').send(examplePost).expect(200);

                const { body } = await request(app).get(`/api/posts/${post._id}`).expect(200);

                expect(body).toEqual(post);
            });

            it('should fail for getting a non-existing post', async () => {
                return request(app).get(`/api/posts/${fakeObjectId}`).expect(404);
            });
        });

        describe('POST /api/posts', () => {
            it('should create a new post', async () => {
                const { body } = await request(app).post('/api/posts').send(examplePost).expect(200);

                expect(body).toEqual(expect.objectContaining(examplePost));
            });

            it('should fail validation for missing fields', async () => {
                return request(app).post('/api/posts').send({}).expect(400);
            });
        });

        describe('PUT /api/posts/:id', () => {
            it('should update post', async () => {
                const propertyForUpdate = 'test2';

                const {
                    body: { _id },
                } = await request(app).post('/api/posts').send(examplePost).expect(200);

                const {
                    body: { data },
                } = await request(app).put(`/api/posts/${_id}`).send({ data: propertyForUpdate }).expect(200);

                expect(data).toEqual(propertyForUpdate);
            });

            it('should fail for updating a non-existing post', async () => {
                return request(app).put(`/api/posts/${fakeObjectId}`).send(examplePost).expect(404);
            });
        });
    });
});
