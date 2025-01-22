/* eslint-disable @typescript-eslint/ban-types */

export interface Comment {
    postId: String;
    senderId: string;
    content: string;
}

export interface CommentDocument extends Comment {
    _id: string;
}
