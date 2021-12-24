const express = require('express');
const controller = require('../controllers/aggregate.js')
const passport = require('passport')
const { authenticator } = require('../../config/passport.js')
const { buildRoutes } = require('./utils/routing.js')

const router = express.Router();

const aggregateRouteConfig = [
    {
        route: '/:locationId/:name/availabledates',
        endPoints: [
            {
                routeName: 'aggregateAvailableDates',
                method: 'post',
                endwares: [authenticator(passport), controller.findDates]
            }
        ]
    },
    {
        route: '/:locationId/:name/:date?',
        endPoints: [
            {
                routeName: 'aggregateAvailableDates',
                method: 'post',
                endwares: [authenticator(passport), controller.findAggregate]
            }
        ]
    }
]

module.exports = buildRoutes(router, aggregateRouteConfig)

// router
//     .route('/:locationId/:name/availabledates')

//     /**
//      * @api {get} /aggregate//:locationId/availabledates Find aggregate data dates (just in case dating turns fucky)
//      * @apiGroup Foo
//      *
//      * @apiSuccess {Boolean} success=true
//      * @apiSuccess {Foo} data
//      */
//     .post(authenticator(passport), controller.findDates)

// router
//     .route('/:locationId/:name/:date?')

//     /**
//      * @api {get} /aggregate//:locationId/:date/:name Find aggregate data
//      * @apiGroup Foo
//      *
//      * @apiSuccess {Boolean} success=true
//      * @apiSuccess {Foo} data
//      */
//     .post(authenticator(passport), controller.findAggregate)

// module.exports = router;
