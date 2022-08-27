const router = require("express").Router();
const Converstion = require("../models/Conversation");


//new conv

router.post("/",async (req,res) => {
    const newConversation = new Converstion({
        members: [req.body.senderId,req.body.receiverId],
    });

    try{
        const conversation = await Converstion.findOne({
            members: {$all: [req.body.senderId,req.body.receiverId]}
        })
        if(conversation)res.status(200).json(conversation);
        else{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//get conv of a user

router.get("/:userId", async (req,res) => {
    try{
        const conversation = await Converstion.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err)
    }
})


//get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async(req,res) => {
    try{
        const conversation = await Converstion.findOne({
            members: {$all: [req.params.firstUserId,req.params.secondUserId]}
        })

        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router