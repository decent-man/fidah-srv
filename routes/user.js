const router = require('express').Router();
const User = require('../model/user');

router.post('/api/user/create',(req, res) =>{
    const {name, email, password} = req.body;
    const newUser = new User({
        name,
        email,
        password 
    })
    res.send(newUser)
})

module.exports = router;