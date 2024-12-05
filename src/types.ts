export interface Comment {
  comment_id?: string;
  parent_comment_id?: string | null;
  video_id?: string;
  user_name?: string;
  content?: string;
  likes_count?: number;
  replies_count?: number;
  created_at?: Date;
}

export interface Video {
  video_id?: string;
  title?: string;
  description?: string;
  created_at?: Date;
}
