const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require('cloudinary')

//update user
router.put("/:id", async(req,res) =>{
   
    let profileImg = []
    if (typeof req.body.profilePicture === 'string') {
        profileImg.push(req.body?.profilePicture)
    } else {
        profileImg = req.body?.profilePicture
    }

    if(profileImg?.length){  
        try{  
            const result = await cloudinary.v2.uploader.upload(profileImg[0], {
                folder: 'socialMediaProfilePictures',
            })
            
            

            req.body.profilePicture = {
                public_id: result.public_id,
                url: result.secure_url,
            }
        }catch(err){
            console.log(err);
        }

    }else{
        req.body.profilePicture = {
            public_id: "",
            url: "",
          }
    }

    let coverImg = []
    if (typeof req.body.coverPicture === 'string') {
        coverImg.push(req.body?.coverPicture)
    } else {
        coverImg = req.body?.coverPicture
    }

    if(coverImg?.length){   
        try{ 
            const result = await cloudinary.v2.uploader.upload(coverImg[0], {
                folder: 'socialMediaCoverPictures',
            })
            


            req.body.coverPicture = {
                public_id: result.public_id,
                url: result.secure_url,
            }
        }catch(err){
            console.log(err);
        }
    }else{
        req.body.coverPicture = {
            public_id: "",
            url: "",
          }
    }
    

    if(req.body.userId === req.params.id || req.body.isAdmin){

        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }

        try{
            
            const oldUser = await User.findById(req.params.id);
            if(oldUser.profilePicture.public_id != "") await cloudinary.v2.uploader.destroy(oldUser.profilePicture?.public_id)
            if(oldUser.coverPicture.public_id != "") await cloudinary.v2.uploader.destroy(oldUser.coverPicture?.public_id)
            await User.findByIdAndUpdate(req.params.id,{$set: req.body})
            const user = await User.findById(req.params.id)
            res.status(200).json(user)
           
        }catch(err){
            console.log('HII2')
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account!");
    }
})

//delete user
router.delete("/:id", async(req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){

        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been Deleted")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can delete only your account!");
    }
})


//get a user
router.get("/",async(req,res) =>{
    const userId = req.query.userId;
    const username = req.query.username;

    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username: username});
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})

//get all users
router.get("/all",async(req,res) =>{

    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})

//get friends
router.get("/friends/:userId",async(req,res) =>{
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        )

        let friendList = []
        friends.map(friend => {
            const {_id, username, profilePicture,name} =friend;
            friendList.push({_id, username, profilePicture,name});
        })

        res.status(200).json(friendList);
    }catch(err){
        res.status(500).json(err);
    }
})

//get followers
router.get("/followers/:userId",async(req,res) =>{
    try{
        const user = await User.findById(req.params.userId);
        const followers = await Promise.all(
            user.followers.map(friendId => {
                return User.findById(friendId)
            })
        )

        let friendList = []
        followers.map(friend => {
            const {_id, username, profilePicture,name} =friend;
            friendList.push({_id, username, profilePicture,name});
        })

        res.status(200).json(friendList);
    }catch(err){
        res.status(500).json(err);
    }
})

//follow a user

router.put("/:id/follow",async(req,res) =>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({$push: {followings: req.params.id}})
                res.status(200).json("user has been followed");

            }else{
                res.status(403).json("you already follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't follow yourself")
    }
})


//unfollow a user

router.put("/:id/unfollow",async(req,res) =>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers: req.body.userId}})
                await currentUser.updateOne({$pull: {followings: req.params.id}})
                res.status(200).json("user has been unfollowed");

            }else{
                res.status(403).json("you dont follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't unfollow yourself")
    }
})

module.exports = router