import mongoose from 'mongoose';
import { config } from '../../config.js';
import { CommentDocument } from './interface.js';

const CommentsSchema = new mongoose.Schema<CommentDocument>(
    {
        content: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: config.mongo.postsCollectionName,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

export const CommentsModel = mongoose.model<CommentDocument>(config.mongo.commentsCollectionName, CommentsSchema);
