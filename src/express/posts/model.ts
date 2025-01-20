import mongoose from 'mongoose';
import { config } from '../../config.js';
import { PostDocument } from './interface.js';

const PostsSchema = new mongoose.Schema<PostDocument>(
    {
        data: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

export const PostsModel = mongoose.model<PostDocument>(config.mongo.postsCollectionName, PostsSchema);
