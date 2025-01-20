import { DocumentNotFoundError } from '../../utils/errors.js';
import { Post, PostDocument } from './interface.js';
import { PostsModel } from './model.js';

export class PostsManager {
    static getByQuery = async (query: Partial<Post>, step: number, limit?: number): Promise<PostDocument[]> => {
        return PostsModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getById = async (postId: string): Promise<PostDocument> => {
        return PostsModel.findById(postId).orFail(new DocumentNotFoundError(postId)).lean().exec();
    };

    static createOne = async (post: Post): Promise<PostDocument> => {
        return PostsModel.create(post);
    };

    static updateOne = async (postId: string, update: Partial<Post>): Promise<PostDocument> => {
        return PostsModel.findByIdAndUpdate(postId, update, { new: true }).orFail(new DocumentNotFoundError(postId)).lean().exec();
    };
}
