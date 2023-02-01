import Post from "../models/Post.js";
import User from "../models/User.js";

/*CREATE*/
export const createPost = async (req,res)=>{
    try{
        const {userId,description,picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{}, //new posts starts with 0 likes
            comments:[],
        })
        await newPost.save();
        const post = await Post.find(); //grab all the posts ever created
        res.status(201).json(post); //201 says created something
    }catch(err){
        res.status(409).json({message:err.message});
        
    }
}

/*READ*/

export const getFeedPosts = async (req,res)=>{
    try{
        const post = await Post.find(); //grab all the posts ever created
        res.status(200).json(post);//200 says successful request
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getUserPosts = async(req,res)=>{
    try{
        const {userId} = req.params;
        const post = await Post.find({userId}); //grab all the posts that current user created
        res.status(200).json(post);//200 says successful request
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

/*UPDATE*/
export const likePost = async(req,res)=>{
    try{
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById({id});
        console.log("------------------Reaching--------");
        const isLiked = post.likes.get(userId); //whether the current user has liked the post or not
        if(isLiked){ //if yes
            post.likes.delete(userId); //delete current user id from posts likes map
        }else{
            post.likes.set(userId,true); //if no, add current user id to post map
        }
        const updatedPost = await Post.findByIdAndUpdate( // update the post
            id,
            {likes:post.likes},
            {new:true} // create a new object
        );
        res.status(200).json(updatedPost);//200 says successful request
    }catch(err){
        console.log('yha h error')
        res.status(404).json({message:err.message});
    }
}