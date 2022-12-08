import User from "../models/User";

/*READ*/
export const getUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}


export const getUserFriends = async(req,res)=>{
    try{

        const {id} = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all( //cause multiple api calls to the mongo database
            user.friends.map((id)=>User.findById(id)) //go to user's friends array and with each friend id return mongo object
        );
        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath}
            }
        );
        res.status(200).json(formattedFriends);

    }catch(err){
        res.status(404).json({message:err.message});
    }
}

/*UPDATE*/
export const addRemoveFriend = async(req,res)=>{
    try{
        const{id,friendId} = req.params;
        const user = await User.findById(id); //current user
        const friend = await User.findById(friendId) //friend
        
        if (user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=>id!==friendId); //removing friend from currrent user
            friend.friends = friend.friends.filter((id)=>id!=id); //removing current user from friend friends array
        } else{
            user.friends.push(friendId); //Add friend to the current user friends array
            friend.friends.push(id); // Add current user to the friend's array
        }

        await  user.save();
        await friend.save();

        const friends = await Promise.all( //cause multiple api calls to the mongo database
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath}
            }
        );
        
        res.status(200).json(formattedFriends);
    }catch(err){
        res.status(404).json({message:err.message}); 
    }
}