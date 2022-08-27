const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true,
   },
   postId: {
    type: String,
    required: true,
   },
   text: {
    type: String,
   }
},
{timestamps: true}
);

module.exports = mongoose.model("Comment", CommentSchema);