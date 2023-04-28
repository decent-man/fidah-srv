const User = require('../model/user');
const { sendError, createRandomBytes } = require('../utils/helper');
const jwt = require('jsonwebtoken');

const { generateOTP, mailTransport } = require('../utils/mail');
const VerificationToken = require('../model/verificationToken');
const ResetToken = require("../model/resetToken");
const { isValidObjectId } = require('mongoose');
const user = require('../model/user');
require('dotenv').config();
const resetToken = require('../model/resetToken');

exports.createUser = async (req, res) =>{
    const {name, email, password} = req.body;
    const exist = await User.findOne({email})
    if(exist) {
        return sendError(res, "This email is already taken")
    }
    const newUser = new User({
        name,
        email,
        password 
    });

    const OTP = generateOTP() 
    const verificationToken = new VerificationToken({
        owner: newUser._id,
        token: OTP
    })

    await verificationToken.save()
    await newUser.save();

    mailTransport().sendMail({
        from: 'emailverification@gmail.com',
        to: newUser.email,
        subject: "Verify Your Email Address",
        html: `<h1>${OTP}</h1>`,
    });
    res.send(newUser)
};

exports.signIn = async (req, res) => {
    const {email, password} = req.body;
    if(!email.trim() || !password.trim()) return sendError(res, " email/password missing!")
    const user = await User.findOne({email})
    if(!user) return sendError(res, "User not Found")

    const isMatched = await user.comparePassword(password)
    if(!isMatched) return sendError(res, "password does not match!")
    const token = jwt.sign({userid: user._id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    res.json({success: true, 
        user: {name: user.name, email:user.email, id: user._id, token},
    });

};

exports.verifyEmail = async (req, res) => {
    const {userId, otp} = req.body
    if(!userId || !otp.trim()) return sendError(res, "Invalid request")

    if(!isValidObjectId(userId)) return sendError(res, "Invalid request")
    const user = await User.findById(userId)
    if(!user) return sendError(res, "Invalid user Id")
    if(user.verified) return sendError(res, "This account is already verified");

    const token = await VerificationToken.findOne({owner: user.id});
    if(!token) return sendError(res, "No user found");

    const isMatched = await token.compareToken(otp)
    if(!isMatched) return sendError(res, "Please provide a valid token");

    user.verified = true;

    await VerificationToken.findByIdAndDelete(token._id);
    await user.save();

    res.json({success: true, message: "your email is Verified"})
};

exports.forgotPassword = async (req, res) => {
    const {email} = req.body;
    if(!email) return sendError(res, "Enter proper Email ")

    const user = await User.findOne({ email });
    if(!user) return sendError(res, "User not found, Invalid request");

    const token = await ResetToken.findOne({owner: user._id});
    if(token) return sendError(res, "Only after one hour request new token");

    const RandomBytes = await createRandomBytes();
    const resetToken = new ResetToken({owner: user.id, token: RandomBytes});
    await resetToken.save()

    mailTransport().sendMail({
        from: 'Reset@gmail.com',
        to: user.email,
        subject: "Password Reset",
        html: `<h1>'http://localhost:3000/reset-password?token=${RandomBytes}&id=${user._id}'</h1>`,
    });
    res.json({success: true, message: "Password reset link is sent to your mail."})
};

exports.resetPassword = async (req, res) => {
    const {password} = req.body;

    const user = await User.findById(req.user._id)
    if(!user) return sendError(res, "user not found")

    const isSamePassword = await user.comparePassword(password)
    if( isSamePassword) return sendError(res, "New Password must be different then previous password");

    if(password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "Password must be 8 to 20 character long!");

    user.password = password.trim();
    await user.save()

    await ResetToken.findOneAndDelete({owner: user._id});
    res.json({success: true, message: "Password reset successfully"})

};