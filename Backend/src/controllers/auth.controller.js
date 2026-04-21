const userModel =require("../models/user.model")

const tokenBlacklistModel= require("../models/blacklist.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
async function registerUserController(req, res) {
    const {username , email , password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide correct Info"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[{username}, {email}]
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
          message:  "Username or Email Already exists"
        })
    }


    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username ,
        email,
        password:hash
    })


    const token = jwt.sign(
        {id:user._id , username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie ("token", token)
res.status(201).json({
    message:"User Registered",
    user:{
        id:user._id,
        username:user.username,
        email: user.email
    }
})

}

async function loginUserController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password"
        });
    }


    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    
    res.cookie("token", token); 
    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function logoutUserController(req,res) {const token = req.cookies.token;
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")

    res.status(200).json({
        message:"User Logged Out"
    })
    
}

async function getMeController(req,res) {
   const  user = await userModel.findById(req.user.id);
   res.status(200).json({
    message:"Info Fetched",
    user:{
        id:user.id,
        username : user.username,
        email: user.email
    }
   })
}


module.exports = { 
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
}