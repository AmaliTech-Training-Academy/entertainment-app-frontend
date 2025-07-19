export interface Comment {
  userId: number;
  mediaId: number;
  commentId?: number;
  comment: string;
  username?: string;
  timestamp?: string; 
}

export interface CommentPost {
  userId: number;
  mediaId: number;
  comment: string;
}
