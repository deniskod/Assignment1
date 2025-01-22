import { Response } from 'express';
import { TypedRequest } from '../../utils/zod.js';
import { PostsManager } from './manager.js';
import { createOneRequestSchema, getByIdRequestSchema, getByQueryRequestSchema, updateOneRequestSchema } from './validations.js';
export class PostsController {
    static getByQuery = async (req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const { step, limit, ...query } = req.query;

        res.json(await PostsManager.getByQuery(query, step, limit));
    };

    static getById = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await PostsManager.getById(req.params.id));
    };

    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await PostsManager.createOne(req.body));
    };

    static updateOne = async (req: TypedRequest<typeof updateOneRequestSchema>, res: Response) => {
        res.json(await PostsManager.updateOne(req.params.id, req.body));
    };
}
