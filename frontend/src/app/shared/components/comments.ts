export interface Comment {
  commentId: number;
  userName: string;
  content: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CommentPost {
  userId: number;
  mediaId: number;
  comment: string;
}
