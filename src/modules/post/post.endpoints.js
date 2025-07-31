import { roles } from "../../DB/models/user.model.js";

const endpoints = {
    createPost: [roles.user],
    updatePost: [roles.user],
    freezePost: [roles.user, roles.admin],
    unfreezePost: [roles.user, roles.admin],
    // deletePost: ["user", "admin"],
    likePost: [roles.user, roles.admin],
    // unlikePost: ["user", "admin"],
    getPost: [roles.user, roles.admin],
    // getTimelinePosts: ["user", "admin"],
    // getProfilePosts: ["user", "admin"],
    // getPosts: ["user", "admin"],
}

export default endpoints;