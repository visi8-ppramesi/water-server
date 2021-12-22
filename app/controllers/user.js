const UserModel = require('../models/user.js')
const ErrorHelper = require('../helpers/error');

module.exports = {
    login: function(req, res){
        console.log({ req, res })
        UserModel.findOne({email: req.body.email})
            .then((user) => {
                if(user && user.validatePassword(req.body.password)){
                    res.status(200).json({ success: true, data: user.toAuthJSON() })
                }else{
                    res.status(403).json({ success: false, message: 'wrong password' });
                }
            })
    },
    register: function(req, res){
        const newUser = new UserModel()
        newUser.email = req.body.email
        newUser.username = req.body.username
        newUser.roles = ['user']
        newUser.setPassword(req.body.password)
        newUser.save().then(user => res.status(200).json({ success: true, data: user.toAuthJSON() }))
            .catch(err => ErrorHelper.response(res, err));
    }
}