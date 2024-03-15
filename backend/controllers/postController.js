import Post from "../model/postModel.js";

export const createPost = async (req, res) => {
    try {

        const { description, image } = req.body;

        const author = req.user._id;

        const newPost = new Post({
            author,
            description,
            image,
        })

        const savedPost = await newPost.save();

        if (!savedPost) {
            return res.status(500).json({ success: false, error: "Failed to save the post" });
        }

        res.status(201).json({ message: 'Post created successfully.', post: savedPost });


    } catch (error) {
        console.log("Error in Create Post controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this post.' });
        }

        await Post.deleteOne({ _id: postId });

        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post.', message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { description, image } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // Check if the user is authorized to update the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to update this post.' });
        }

        post.description = description || post.description;
        post.image = image || post.image;

        await post.save();

        res.status(200).json({ message: 'Post updated successfully.', post });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post.', message: error.message });
    }
};


export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "_id username email");

        res.status(201).json({ message: 'Post fetchedd successfully.', posts: posts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts.', error: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {

        const userId = req.params.id;

        const userPosts = await Post.find({ author: userId })

        if (!userPosts) {
            return res.status(404).json({ message: 'No posts found for the specified user.' });
        }

        res.status(200).json({ message: 'Post fetchedd successfully.', posts: userPosts });


    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Failed to fetch user posts.', error: error.message });
    }
}


export const toggleLike = async (req, res) => {
    try {

        const postId = req.params.postId;

        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post Not found" });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({ message: 'Like toggled successfully.', post });

    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Failed to toggle like.', error: error.message });
    }
}


export const addComment = async (req, res) => {

    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Comment content cannot be empty.' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not Found" });
        }

        post.comments.push({
            user: userId,
            content
        });

        await post.save();

        res.status(201).json({ message: 'Comment added successfully.', post });

    } catch (error) {
        console.error('Error adding comment controller:', error);
        res.status(500).json({ message: 'Failed to add comment.', error: error.message });
    }
}


export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const commentIndex = post.comments.findIndex(comment => comment._id == commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        post.comments.splice(commentIndex, 1);

        await post.save();

        res.status(200).json({ message: 'Comment deleted Successfully', post });
    } catch (error) {
        console.error('Error deleting comment contoller:', error);
        res.status(500).json({ message: 'Failed to delete comment.', error: error.message });
    }
}