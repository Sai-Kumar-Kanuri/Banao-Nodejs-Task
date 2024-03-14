import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { addComment, createPost, deleteComment, getPosts, getUserPosts, toggleLike } from "../controllers/postController.js";


const router = express.Router();


router.post("/create", protectRoute, createPost);
router.get("/getposts/all", protectRoute, getPosts);
router.get("/getposts/:id", protectRoute, getUserPosts);
router.post("/:postId/like", protectRoute, toggleLike);
router.post("/addcomment/:id", protectRoute, addComment);
router.delete("/deletecomment/:postId/:commentId", protectRoute, deleteComment);



export default router;