const { check, validationResult } = require('express-validator');

exports.validateUser =  [
    check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('name is empty')
    .isLength({min: 3, max: 20},
    check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is invalid'),    
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('password is missing!')
    .isLength({min:8, max: 16})
    .withMessage('Password must be 8 to 16 character long ')
    )];


exports.validate = (req, res, next) => {
    const error = validationResult(req).array()
    if(!error.length) return next()

    res.status(400).json({success: false, error: error[0].msg})
}    