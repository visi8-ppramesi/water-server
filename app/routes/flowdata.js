const express = require('express');
const controller = require('../controllers/flowdata')
const hashCheck = require('../middlewares/checkHash')
const passport = require('passport')
const { authenticator } = require('../../config/passport.js')
const { buildRoutes } = require('./utils/routing.js')

const router = express.Router();

const flowdataRouteConfig = [
    {
        route: '/',
        endPoints: [
            {
                routeName: 'listFlowdata',
                method: 'get',
                endwares: [authenticator(passport), controller.list]
            },
            {
                routeName: 'postFlowdata',
                method: 'post',
                endwares: [hashCheck, controller.create]
            },
        ]
    },
    {
        route: '/:id',
        endPoints: [
            {
                routeName: 'getFlowdata',
                method: 'get',
                endwares: [authenticator(passport), controller.findById]
            },
            {
                routeName: 'putFlowdata',
                method: 'put',
                endwares: [authenticator(passport), controller.update]
            },
            {
                routeName: 'deleteFlowdata',
                method: 'delete',
                endwares: [authenticator(passport), controller.delete]
            }
        ]
    },
]

module.exports = buildRoutes(router, flowdataRouteConfig);

// router
//   .route('/')

//   /**
//   * @api {get} /flowdata List
//   * @apiGroup Foo
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo[]} data
//   */
//   .get(authenticator(passport), controller.list)

//   /**
//   * @api {post} /flowdata Create
//   * @apiGroup Foo
//   *
//   * @apiParam {String} name
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo} data
//   */
//   .post(hashCheck, controller.create);

// router
//   .route('/:id')

//   /**
//   * @api {get} /flowdata/:id Find
//   * @apiGroup Foo
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo} data
//   */
//   .get(authenticator(passport), controller.findById)

//   /**
//   * @api {put} /flowdata/:id Update
//   * @apiGroup Foo
//   *
//   * @apiParam {String} name
//   *
//   * @apiSuccess {Boolean} success=true
//   */
//   .put(authenticator(passport), controller.update)

//   /**
//   * @api {delete} /flowdata/:id Delete
//   * @apiGroup Foo
//   *
//   * @apiSuccess {Boolean} success=true
//   */
//   .delete(authenticator(passport), controller.delete);

// module.exports = router;
