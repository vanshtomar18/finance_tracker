const User = require("../models/User");

const jwt= require("jsonwebtoken");

//generte JWT token

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30d"});
};

//Register user
exports.registerUser=async(req,res)=>{
    const {fullName,email,password,profileImageUrl}=req.body;

    //validation : check for missing fields
    if(!fullName || !email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }
    //check if user already exists

    try{
        const existingUser= await User.findByEmail(email);
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        //create new user
        const user= await User.create({
            name: fullName,
            email,
            password,
            profile_photo: profileImageUrl,
        });

        res.status(201).json({
            id: user.id,
            user: user.toJSON(),
            token: generateToken(user.id),
        });
    }catch(err){
        res
        .status(500)
        .json({message:"Error registering user",error:err.message});
    }
};

//Login user
exports.loginUser=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }
    try{
        const user=await User.findByEmail(email);
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message:"Invalid credentials"});
        }
        res.status(200).json({
            id:user.id,
            user: user.toJSON(),
            token:generateToken(user.id),
        });
    }catch(err){
        res
        .status(500)
        .json({message:"Error logging in user",error:err.message});
    };
};
//get user info
exports.getUserInfo=async(req,res)=>{
    try{
        const user= await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user.toJSON());
    }catch(err){
        res.status(500).json({message:"Error getting user info",error:err.message});
    }
};

//update user profile
exports.updateUserProfile = async(req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, profileImageUrl } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = {
            name: fullName || user.name,
            email: user.email,
            profile_photo: profileImageUrl !== undefined ? profileImageUrl : user.profile_photo
        };

        const updatedUser = await user.update(updateData);

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser.toJSON()
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
};