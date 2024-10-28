const Users=require('../models/userModel')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const express=require('express')
const auth=require('../middleware/auth')
const router=express.Router()
const bcrypt = require("bcrypt");

router.post('/adduser',async(req,res)=>{
    try{
        let user_valid=await Users.findOne({email:req.body.email})
        if(user_valid){
            return res.send({"message":"User Already exists"})//early return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user=new Users({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        })
        await user.save()
        res.send(user)

    }catch(e){
        res.send("Some internal error in the Server")
    }
})

router.get("/", auth, async (req, res) => {
    const profile = await Users.findById(req.user._id);
    res.send(profile);
  });


router.post('/requestPasswordReset',async(req,res)=>{
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).send("User Not Found");
        }
        const token = crypto.randomBytes(20).toString('hex'); // Generates a 32-character hex string

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();
       
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Password Reset Request</h2>
                    <p>Click the button below to reset your password:</p>
                    <a href="https://password-reset-3b2j.onrender.com/api/user/reset-password?token=${token}&email=${email}"
                       style="
                           display: inline-block;
                           padding: 10px 20px;
                           margin-top: 20px;
                           font-size: 16px;
                           color: #ffffff;
                           background-color: #007bff;
                           text-decoration: none;
                           border-radius: 5px;
                           font-weight: bold;
                       ">
                       Reset Password
                    </a>
                    <p style="margin-top: 20px; color: #555;">
                       If you didn’t request this, please ignore this email.
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

router.get('/reset-password',  async(req, res) => {
    const { token, email } = req.query;
    const user = await Users.findOne({
        email,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Check if token has expired
    });
    // Verify the token
    if (user) {
        res.redirect(`tranquil-sopapillas-954548.netlify.app/newform?token=${token}&email=${email}`);
    } else {
        res.status(400).send('Invalid or expired token.');
    }
});

router.post('/update-password',  async (req, res) => {
    const { email, token, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        // Find user with matching email and valid token
        const user = await Users.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = hashedPassword; 
        user.resetPasswordToken = undefined; // Clear the token
        user.resetPasswordExpires = undefined; // Clear the expiration
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports=router
