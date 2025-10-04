const jwt=require("jsonwebtoken");
const User=require("../models/User");

exports.protect=async(req,res,next)=>{
    let token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Not authorized, no token"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        req.user = user.toJSON(); // Use toJSON() to exclude password
        next();
    }catch(err){
        console.error("Auth middleware error:", err);
        res.status(401).json({message:"Not authorized, token failed"});
    }
};
