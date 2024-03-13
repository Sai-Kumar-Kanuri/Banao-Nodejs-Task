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

