const express = require('express');
const controller = require('../controllers/user.js');
const userRegisterValidator = require('../validators/userRegister.js')
const passport = require('passport')
const { authenticator } = require('../../config/passport.js')
const { buildRoutes } = require('./utils/routing.js')

const router = express.Router();

const userRouteConfig = [
    {
        route: '/',
        endPoints: [
            {
                routeName: 'getUser',
                method: 'get',
                endwares: [authenticator(passport), controller.get]
            }
        ]
    },
    {
        route: '/login',
        endPoints: [
            {
                routeName: 'loginUser',
                method: 'post',
                endwares: [controller.login]
            }
        ]
    },
    {
        route: '/register',
        endPoints: [
            {
                routeName: 'registerUser',
                method: 'post',
                endwares: [...userRegisterValidator, controller.register]
            }
        ]
    }
]

module.exports = buildRoutes(router, userRouteConfig)

// router
//     .route('/')

//     /**
//      * @api {get} /user/ get current user
//      * @apiGroup Foo
//      *
//      * @apiSuccess {Boolean} success=true
//      * @apiSuccess {Foo} data
//      */
//     .get(authenticator(passport), controller.get)


// router
//     .route('/login')

//     /**
//      * @api {get} /user/login user login
//      * @apiGroup Foo
//      *
//      * @apiSuccess {Boolean} success=true
//      * @apiSuccess {Foo} data
//      */
//     .post(controller.login)

// router
//     .route('/register')

//     /**
//      * @api {get} /user/register user register
//      * @apiGroup Foo
//      *
//      * @apiSuccess {Boolean} success=true
//      * @apiSuccess {Foo} data
//      */
//     .post(...userRegisterValidator, controller.register)

// module.exports = router;
