const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register
router.post("/register",async(req,res) => {
    
    try{
        
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //new user
        const newUser = await new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        //save user and return res
        const user = await newUser.save();
        res.status(200).json(user);
       
    }catch(err){
        res.status(500).json(err)
    }

});


//login
router.post("/login",async(req,res) => {

    try{
        const user = await User.findOne({
            email: req.body.email
        });

        !user && res.status(404).send("user not found")

        const validPassword = await bcrypt.compare(req.body.password,user.password)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(user);
    }catch(err){
        console.log('Login Error - credentials not found!')
        // res.status(500).json(err)
    }
})

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

//forgot password
router.get("/reset/:email",async(req,res) =>{
    try{
        const user = await User.findOne({
            email: req.params.email
        });

        const password = makeid(10);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        await user.updateOne({password: hashedPassword});

        res.status(200).json({name: user.name,password: password});
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router