const { body, validationResult } = require('express-validator')
const passwordValidator = require('password-validator')
const UserModel = require('../models/user.js')
const schema = new passwordValidator()

schema
  .is().min(8)
  .is().max(100)

const passwordValidating = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(schema.validate(req.body.password)){
        next()
    }else{
        res.status(400).json({ success: false, message: 'bad password' })
    }
}

module.exports = [
    body('username').isLength({ min: 5 }).custom(value => {
        return UserModel.findOne({ username: value }).then(user => {
            if (user) {
                return Promise.reject('Username already in use');
            }
        });
    }),
    body('email').isEmail().custom(value => {
        return UserModel.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        });
    }),
    passwordValidating
]