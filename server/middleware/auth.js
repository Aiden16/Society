import jwt from "jsonwebtoken";

export const verifyToken = async (req,res,next) => {
    try{
        let token = req.header("Authorization") //from frontend grabbing the authorization header
        if(!token){
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.lenght).trimLeft();
        }

        const verified = jwt.verify(token,proccess.env.JWT_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(500).json({error:err.message});
    }
} 