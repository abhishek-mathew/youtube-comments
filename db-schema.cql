-- Comments table
CREATE TABLE comments (
    comment_id UUID PRIMARY KEY,
    parent_comment_id UUID,
    video_id UUID,
    user_name TEXT,
    content TEXT,
    likes_count INT,
    replies_count INT,
    created_at TIMESTAMP
);

-- Videos table
CREATE TABLE videos (
    video_id UUID PRIMARY KEY,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP
);
