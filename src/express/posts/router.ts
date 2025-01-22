import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import { createOneRequestSchema, getByIdRequestSchema, getByQueryRequestSchema, updateOneRequestSchema } from './validations.js';
import { PostsController } from './controller.js';

export const postsRouter = Router();

postsRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(PostsController.getByQuery));

postsRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(PostsController.getById));

postsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(PostsController.createOne));

postsRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(PostsController.updateOne));
