import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId:{
            type:String,
            required:true
        },
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        location:String,
        description:String,
        picturesPath:String,
        userPicturePath:String,
        likes:{
            type:Map,
            of:Boolean //just check if user id exits, if yes then post is liked by the current user else yet to like
        },
        comments:{
            type:Array,
            default:[]
        }
    },
    {
        timestamps:true
    }
);

const Post = mongoose.model("Post",postSchema);
export default Post;