// const passport = require('passport')
const passportJWT = require("passport-jwt");
const UserModel = require('../app/models/user.js')
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt
const env = require('dotenv').config().parsed

module.exports = {
    init: (passport) => {
        passport.initialize()
        passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET,
            passReqToCallback: true
        }, function(req, jwtPayload, done){
            const now = +(new Date)
            if(env.ENV !== 'local'){
                if(jwtPayload.userAgent !== req.get('User-Agent') || (jwtPayload.ip !== req.ip && env.IP_AUTHENTICATION === 'true')){
                    return done(null, false, { errors: { 'user agent or ip': 'invalid' } })
                }
            }
            if(now > jwtPayload.exp){
                return done(null, false, { errors: { 'email or password': 'expired' } })
            }
            return UserModel.findOne({email: jwtPayload.email, _id: jwtPayload.id})
                .then(user => {
                    req.user = user
                    return done(null, user);
                }
                ).catch(err => {
                    return done(err);
                });
        }))
    },
    authenticator: (passport, config = {}) => {
        if(!config.session){
            config.session = false
        }

        return passport.authenticate('jwt', config)
    },
    roleChecker: (routeName) => {
        return function(req, res, next){
            //check role here
            next()
        }
    }
}