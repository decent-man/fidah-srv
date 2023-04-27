const User = require('../model/user');
const { sendError } = require('../utils/helper');
const jwt = require('jsonwebtoken');

const { generateOTP } = require('../utils/mail');
const VerificationToken = require('../model/verificationToken');
require('dotenv').config();

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

}