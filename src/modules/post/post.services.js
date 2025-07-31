import { nanoid } from "nanoid";
import Post from "../../DB/models/post.model.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import { roles } from "../../DB/models/user.model.js";



export const createPost = async (req, res, next) => {
    const { user } = req;
    const { text} = req.body;

    let images = []
    let cloudfolder;
    if (req.files.length) {
        cloudfolder = nanoid();
        for (const file of req.files) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(
                file.path,
                {folder: `users/${user._id}/posts/${cloudfolder}`}
            );
            images.push({secure_url, public_id})
        }
    }

    const post = new Post({
        text,
        images,
        cloudfolder,
        user: user._id
    });

    await post.save();

    return res.status(201).json({ success: true, post, message: "Post created successfully!" });
}




export const updatePost = async (req, res, next) => {
    const { user } = req;
    const { text} = req.body;
    const {id} = req.params;

    const post = await Post.findOne({_id: id, user: user._id});
    if (!post) return next(new Error("Post not found!", {cause: 404}))

    

    let images = []
    let cloudfolder;
    if (req.files.length) {
        cloudfolder = nanoid();
        for (const file of req.files) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(
                file.path,
                {folder: `users/${user._id}/posts/${post.cloudfolder}`}
            );
            images.push({secure_url, public_id})
        }
    }

    post.text = text ? text : post.text;

    if(post.images.length) {
        for (const image of post.images) {
            const results = await cloudinary.uploader.destroy(image.public_id);
        }
    }

    post.images = images;

    await post.save();

    return res.status(201).json({ success: true, post, message: "Post created successfully!" });
}


export const freezePost = async (req, res, next) => {
    const { user } = req;
    const {id} = req.params;

    const post = await Post.findById(id);

    if(!post) return next(new Error("Post not found", {cause: 404}));

    if(post.user.toString() == user._id.toString() || user.role == roles.admin) {
        post.isDeleted = true;
        post.deletedBy = req.user._id;
    }

    post.save();

    return res.json({success: true, results: {post}});
}



export const unfreezePost = async (req, res, next) => {
    const { user } = req;
    const {id} = req.params;



    const post = await Post.findByIdAndUpdate({
        _id: id,
        isDeleted: true,
        deletedBy: user._id
    }, {
        isDeleted: false,
        $unset: {deletedBy: 0}
    }, {
        new: true,
        runValidators: true
    } 
    );

    if(!post) return next(new Error("Post not found", {cause: 404}));

    return res.json({success: true, results: {post}});
}



export const getPost = async (req, res, next) => {
    const post = await Post.findOne({
        _id: req.params.id,
        isDeleted: false
    }).populate({path: "user", select: "username profilePicture"});

    if(!post) return next(new Error("Post not found", {cause: 404}));

    return res.json({success: true, results: {post}});
}



export const allActivePost = async (req, res, next) => {
    let posts;

    if (req.user.role == roles.admin) {
        posts = await Post.find({isDeleted: false}).populate({path: "user", select: "username profilePicture"});
    } else if (req.user.role == roles.user) {
        posts = await Post.find({isDeleted: false, user: req.user._id}).populate({path: "user", select: "username profilePicture"});
    }

    return res.json({success: true, results: {posts}});
}


export const allFreezePost = async (req, res, next) => {
    let posts;

    if (req.user.role == roles.admin) {
        posts = await Post.find({isDeleted: true}).populate({path: "user", select: "username profilePicture"});
    } else if (req.user.role == roles.user) {
        posts = await Post.find({isDeleted: true, user: req.user._id}).populate({path: "user", select: "username profilePicture"});
    }

    return res.json({success: true, results: {posts}});
}




export const likeUnlikePost = async (req, res, next) => {
    const {id} = req.params;

    const userId = req.user._id;
    const post = await Post.findById({_id: id, isDeleted: false});

    if(!post) return next(new Error("Post not found", {cause: 404}));

    const isUserExist = post.likes.find((user) => user.toString() == userId.toString());

    if(!isUserExist) {
        post.likes.push(userId);
    } else {
        post.likes = post.likes.filter((user) => user.toString() != userId.toString())
    }

    await post.save();

    const populatedPost = await Post.findById({_id: id, isDeleted: false}).populate({path: "likes", select: "username profilePicture"});

    return res.json({success: true, results: {populatedPost}});
}