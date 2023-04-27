const router = require('express').Router();
const { createUser, signIn } = require('../controllers/user');
const { validateUser, validate } = require('../middlewares/validator');


router.post('/create',validateUser, validate, createUser);
router.post('/signIn', signIn);

module.exports = router;