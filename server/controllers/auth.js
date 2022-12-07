import bcrypt from "bcrypt"; //allow us to encrypt the passwior
import jwt from "jsonwebtoken"; //sends users web token for authorization
import User from "../models/User.js";

/*Register user*/

export const register = async (req,res) => { //async cause we making call to mongodb
    try{
        const {
            firtsName,
            lastName,
            email,
            password,
            picturesPath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);
        const newUser = new User({
            firtsName,
            lastName,
            email,
            password: passwordHash,
            picturesPath,
            friends,
            location,
            occupation,
            viewedProfile:Math.floor(Math.random()*10000),
            impressions:Math.floor(Math.random()*10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); //send user back status code 201 and json version of savedUser
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

/*logging In*/
export const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).json({msg:"User does not exist."});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid Credentials. "});

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET); //JWT
        delete user.password; //so the password doesn't get send to the frontend
        res.status(200).json({token,user});
    }catch(err){
        res.status(500).json({error:err.message});

    }
}

