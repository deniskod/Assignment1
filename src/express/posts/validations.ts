import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod.js';

const requiredFields = z
    .object({
        senderId: z.string(),
        data: z.string(),
    })
    .required();

// GET /api/posts
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(requiredFields.partial()),
    params: z.object({}),
});

// GET /api/posts/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/posts
export const createOneRequestSchema = z.object({
    body: requiredFields,
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/posts/:id
export const updateOneRequestSchema = z.object({
    body: requiredFields.partial(),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
