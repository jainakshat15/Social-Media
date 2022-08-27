const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cloudinary = require("cloudinary")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const cors = require('cors');


dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true},() =>{
    console.log('connected to database')
})

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
)

//middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload());
app.use(helmet());
app.use(cors());
//app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/comments", commentRoute);



app.listen(process.env.PORT || 8800, () => {
    console.log('Backend server is running!')
})