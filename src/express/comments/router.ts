import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import {
    createOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    updateOneRequestSchema,
    deleteOneRequestSchema,
} from './validations.js';
import { CommentsController } from './controller.js';

export const commentsRouter = Router();

commentsRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(CommentsController.getByQuery));

commentsRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(CommentsController.getById));

commentsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(CommentsController.createOne));

commentsRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(CommentsController.updateOne));

commentsRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(CommentsController.deleteOne));
