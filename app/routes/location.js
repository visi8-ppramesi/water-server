const express = require('express');
const controller = require('../controllers/location');
const hashCheck = require('../middlewares/checkHash')
const passport = require('passport')
const { authenticator } = require('../../config/passport.js')
const { buildRoutes } = require('./utils/routing.js')
const { listLocationGate, postLocationGate, pingLocationGate } = require('../gates/location.js')

const router = express.Router();

const locationRouteConfig = [
    {
        route: '/',
        endPoints: [
            {
                routeName: 'listLocation',
                method: 'get',
                endwares: [authenticator(passport), listLocationGate, controller.list]
            },
            {
                routeName: 'postLocation',
                method: 'post',
                endwares: [authenticator(passport), postLocationGate, controller.create]
            }
        ]
    },
    {
        route: '/ping/:id',
        endPoints: [
            {
                routeName: 'pingLocation',
                method: 'post',
                endwares: [hashCheck, controller.ping]
            }
        ]
    },
    {
        route: '/withflowdata',
        endPoints: [
            {
                routeName: 'listLocationWithFlowdata',
                method: 'post',
                endwares: [authenticator(passport), controller.listWithFlowdata]
            }
        ]
    },
    {
        route: '/withflowdata/:id',
        endPoints: [
            {
                routeName: 'getLocationWithFlowdata',
                method: 'post',
                endwares: [authenticator(passport), controller.findWithFlowdata]
            }
        ]
    },
    {
        route: '/:id',
        endPoints: [
            {
                routeName: 'getLocation',
                method: 'get',
                endwares: [authenticator(passport), controller.findById]
            },
            {
                routeName: 'putLocation',
                method: 'put',
                endwares: [authenticator(passport), controller.update]
            },
            {
                routeName: 'deleteLocation',
                method: 'delete',
                endwares: [authenticator(passport), controller.delete]
            }
        ]
    }
]

module.exports = buildRoutes(router, locationRouteConfig)

// router
//   .route('/')

//   /**
//   * @api {get} /location List
//   * @apiGroup Foo
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo[]} data
//   */
//   .get(authenticator(passport), controller.list)

//   /**
//   * @api {post} /location Create
//   * @apiGroup Foo
//   *
//   * @apiParam {String} name
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo} data
//   */
//   .post(hashCheck, controller.create);

// router
//   .route('/ping/:id')

//   /**
//   * @api {get} /ping a location to keep status
//   * @apiGroup Foo
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo[]} data
//   */
//   .post(hashCheck, controller.ping)

// router
//   .route('/withflowdata')

//   /**
//   * @api {post} /location/withflowdata listWithFlowdata
//   * @apiGroup Foo
//   *
//   * @apiParam {String} name
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo} data
//   */
//   .post(authenticator(passport), controller.listWithFlowdata)

// router
//   .route('/withflowdata/:id')

//   /**
//   * @api {post} /location/withflowdata listWithFlowdata
//   * @apiGroup Foo
//   *
//   * @apiParam {String} name
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo} data
//   */
//   .post(authenticator(passport), controller.findWithFlowdata)

// router
//   .route('/:id')

//   /**
//   * @api {get} /location/:id Find
//   * @apiGroup Foo
//   *
//   * @apiSuccess {Boolean} success=true
//   * @apiSuccess {Foo} data
//   */
//   .get(authenticator(passport), controller.findById)

//   /**
//   * @api {put} /location/:id Update
//   * @apiGroup Foo
//   *
//   * @apiParam {String} name
//   *
//   * @apiSuccess {Boolean} success=true
//   */
//   .put(authenticator(passport), controller.update)

//   /**
//   * @api {delete} /location/:id Delete
//   * @apiGroup Foo
//   *
//   * @apiSuccess {Boolean} success=true
//   */
//   .delete(authenticator(passport), controller.delete);

// module.exports = routeBuilder(router, locationRouteConfig);
