import { DocumentNotFoundError } from '../../utils/errors.js';
import { Comment, CommentDocument } from './interface.js';
import { CommentsModel } from './model.js';

export class CommentsManager {
    static getByQuery = async (query: Partial<Comment>, step: number, limit?: number): Promise<CommentDocument[]> => {
        return CommentsModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getById = async (commentId: string): Promise<CommentDocument> => {
        return CommentsModel.findById(commentId).orFail(new DocumentNotFoundError(commentId)).lean().exec();
    };

    static createOne = async (comment: Comment): Promise<CommentDocument> => {
        return CommentsModel.create(comment);
    };

    static updateOne = async (commentId: string, update: Partial<Comment>): Promise<CommentDocument> => {
        return CommentsModel.findByIdAndUpdate(commentId, update, { new: true }).orFail(new DocumentNotFoundError(commentId)).lean().exec();
    };

    static deleteOne = async (commentId: string): Promise<CommentDocument> => {
        return CommentsModel.findByIdAndDelete(commentId).orFail(new DocumentNotFoundError(commentId)).lean().exec();
    };
}
