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
import { Comment } from '../src/express/comments/interface.js';

const { mongo } = config;

const fakeObjectId = '111111111111111111111111';
const fakeCommentId = '111111111111111111112222';

const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection!.deleteMany({});
    }
};

const exampleComment: Comment = {
    content: 'hello there',
    senderId: '123',
    postId: fakeCommentId,
};

describe('e2e comments api testing', () => {
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

    describe('/api/comments', () => {
        describe('GET /api/comments', () => {
            it('should get all the comments', async () => {
                const comments: Comment[] = [];
 
                for (let i = 0; i < 3; i++) {
                    const { body: comment } = await request(app).post('/api/comments').send(exampleComment).expect(200);

                    comments.push(comment);
                } 

                const { body } = await request(app).get('/api/comments').expect(200);

                expect(body).toEqual(comments);
            });

            it('should get comments with pagination', async () => {
                const comments: Comment[] = [];

                for (let i = 0; i < 15; i++) {
                    const { body: comment } = await request(app).post('/api/comments').send(exampleComment).expect(200);

                    comments.push(comment);
                }

                const [{ body: body1 }, { body: body2 }, { body: body3 }] = await Promise.all([
                    request(app).get('/api/comments').query({ limit: 5, step: 0 }).expect(200),
                    request(app).get('/api/comments').query({ limit: 5, step: 1 }).expect(200),
                    request(app).get('/api/comments').query({ limit: 5, step: 2 }).expect(200),
                ]);

                expect(body1).toEqual(comments.slice(0, 5));
                expect(body2).toEqual(comments.slice(5, 10));
                expect(body3).toEqual(comments.slice(10, 15));
            });

            it('should get an empty array', async () => {
                const { body } = await request(app).get('/api/comments').query({ limit: 100 }).expect(200);

                expect(body).toEqual([]);
            });
        });

        describe('GET /api/comments/:id', () => {
            it('should get a comment', async () => {
                const { body: comment } = await request(app).post('/api/comments').send(exampleComment).expect(200);

                const { body } = await request(app).get(`/api/comments/${comment._id}`).expect(200);

                expect(body).toEqual(comment);
            });

            it('should fail for getting a non-existing comment', async () => {
                return request(app).get(`/api/comments/${fakeObjectId}`).expect(404);
            });
        });

        describe('POST /api/comments', () => {
            it('should create a new comment', async () => {
                const { body } = await request(app).post('/api/comments').send(exampleComment).expect(200);

                expect(body).toEqual(expect.objectContaining(exampleComment));
            });

            it('should fail validation for missing fields', async () => {
                return request(app).post('/api/comments').send({}).expect(400);
            });
        });

        describe('PUT /api/comments/:id', () => {
            it('should update comment', async () => {
                const propertyForUpdate = 'test2';

                const {
                    body: { _id },
                } = await request(app).post('/api/comments').send(exampleComment).expect(200);

                const {
                    body: { content },
                } = await request(app).put(`/api/comments/${_id}`).send({ content: propertyForUpdate }).expect(200);

                expect(content).toEqual(propertyForUpdate);
            });

            it('should fail for updating a non-existing comment', async () => {
                return request(app).put(`/api/comments/${fakeObjectId}`).send(exampleComment).expect(404);
            });
        });

        describe('DELETE /api/comments/:id', () => {
            it('should delete comment', async () => {
                const {
                    body: { _id },
                } = await request(app).post('/api/comments').send(exampleComment).expect(200);

                return request(app).delete(`/api/comments/${_id}`).expect(200);
            });

            it('should fail for deleting a non-existing comment', async () => {
                return request(app).delete(`/api/comments/${fakeObjectId}`).expect(404);
            });
        });

    });
});
