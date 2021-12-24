const UserModel = require('../models/user.js')
const ErrorHelper = require('../helpers/error');

module.exports = {
    get: function(req, res){
        new Promise((resolve, reject) => {
            resolve()
        }).then((_) => {
            const data = Object.assign({}, req.user.toJSON())
            if(delete data.salt && delete data.password){
                res.status(200).json({ success: true, data })
            }else{
                res.status(400).json({ success: false, message: 'something fucked up' });
            }
        })
    },
    login: function(req, res){
        UserModel.findOne({email: req.body.email})
            .then((user) => {
                if(user && user.validatePassword(req.body.password)){
                    res.status(200).json({ success: true, data: user.toAuthJSON({ userAgent: req.get('User-Agent'), ip: req.ip })})
                }else{
                    res.status(403).json({ success: false, message: 'wrong password or no user found' });
                }
            })
    },
    register: function(req, res){
        const newUser = new UserModel()
        newUser.email = req.body.email
        newUser.username = req.body.username
        newUser.roles = ['user']
        newUser.setPassword(req.body.password)
        newUser.save().then(user => res.status(200).json({ success: true, data: user.toAuthJSON({ userAgent: req.get('User-Agent'), ip: req.ip })}))
            .catch(err => ErrorHelper.response(res, err));
    }
}