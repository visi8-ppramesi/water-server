const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const env = require('dotenv').config().parsed
const { roles } = require('../../config/roles.js')
const userStreamHandler = require('../handlers/stream/user.js')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        enum: roles,
        default: 'user'
    }]
}, { timestamps: true });

UserSchema.methods.setPassword = function(rawPassword) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(rawPassword, this.salt, 10000, 512, 'sha512').toString('hex');
};
  
UserSchema.methods.validatePassword = function(rawPassword) {
    const password = crypto.pbkdf2Sync(rawPassword, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === password;
};
  
UserSchema.methods.generateJWT = function(userInfo = {}) {
    const expirationDate = new Date(+(new Date()) + parseInt(env.JWT_EXPIRATION));
    console.log(parseInt(expirationDate.getTime(), 10))
  
    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime(), 10),
        ...userInfo
    }, env.JWT_SECRET);
}
  
UserSchema.methods.toAuthJSON = function(userInfo = {}) {
    return {
        id: this._id,
        email: this.email,
        token: this.generateJWT(userInfo),
    };
};

UserSchema.methods.addRole = function(role){
    if(roles.includes(role) && !this.roles.includes(role)){
        this.roles.push(role)
    }
}

UserSchema.methods.removeRole = function(role){
    if(roles.includes(role) && this.roles.includes(role)){
        this.roles = this.roles.filter(myRole => myRole !== role)
    }
}

const UserModel = mongoose.model('user', UserSchema)

if(env.DB_IS_REPLICA_SET === 'true'){
    UserModel.watch().on('change', userStreamHandler.invoker())
}

module.exports = UserModel