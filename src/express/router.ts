import { Router } from 'express';
import { postsRouter } from './posts/router.js';

export const appRouter = Router();

appRouter.use('/api/posts', postsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
