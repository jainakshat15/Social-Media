const router = require("express").Router();
const Comment = require("../models/Comment");

//add
router.post("/",async(req,res) => {
    const newComment = new Comment(req.body);
    try{
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    }catch(err){
        res.status(500).json(err)
    }
})


//get

router.get("/:postId",async(req,res) => {
    try{
        const comments = await Comment.find({
            postId: req.params.postId,
        })
        res.status(200).json(comments);
    }catch(err){
        res.status(500).json(err)
    }
})


//delete comment

router.delete("/:commentId",async(req,res) =>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(comment.userId === req.body.userId){
            await comment.deleteOne();
            res.status(200).json("The Comment has been Deleted");
        }else{
            res.status(403).json("You can Delete only your comment");
        }
    }catch(err){
        res.status(500).json(err);
    }
})

//delete all comments of a post
router.delete("/post/:postId",async(req,res) =>{
    try{
            await Comment.deleteMany({postId: req.params.postId});
            res.status(200).json("The Comments has been Deleted");
       
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})



module.exports = router