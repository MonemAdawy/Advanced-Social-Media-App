import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middlware.js";
import validation from "../../middleware/validation.middleware.js";
import * as postService from "./post.services.js";
import endpoints from "./post.endpoints.js";
import * as postSchema from "./post.validation.js"
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router();


// create post
router.post("/", asyncHandler(isAuthenticated), isAuthorized(endpoints.createPost), uploadCloud().array("images"), validation(postSchema.createPost), asyncHandler(postService.createPost));

//update post
router.patch("/:id", asyncHandler(isAuthenticated), isAuthorized(endpoints.updatePost), uploadCloud().array("images"), validation(postSchema.updatePost), asyncHandler(postService.updatePost))

// soft-delete post
router.patch("/:id/freeze", asyncHandler(isAuthenticated), isAuthorized(endpoints.freezePost), validation(postSchema.freezePost), asyncHandler(postService.freezePost))

// restore post
router.patch("/:id/unfreeze", asyncHandler(isAuthenticated), isAuthorized(endpoints.unfreezePost), validation(postSchema.unfreezePost), asyncHandler(postService.unfreezePost));

// get single post
router.get("/:id", asyncHandler(isAuthenticated), isAuthorized(endpoints.getPost), validation(postSchema.getPost), asyncHandler(postService.getPost));

// get active post
router.get("/all/active", asyncHandler(isAuthenticated), isAuthorized(endpoints.getPost), asyncHandler(postService.allActivePost));

// get all freezed posts
router.get("/all/freeze", asyncHandler(isAuthenticated), isAuthorized(endpoints.getPost), asyncHandler(postService.allFreezePost));

// like unlike post
router.patch("/:id/like-unlike", asyncHandler(isAuthenticated), isAuthorized(endpoints.likePost), validation(postSchema.likePost), asyncHandler(postService.likeUnlikePost))

export default router;