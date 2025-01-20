export interface Post {
    senderId: string;
    data: string;
}

export interface PostDocument extends Post {
    _id: string;
}
