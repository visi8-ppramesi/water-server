const express = require('express');
const controller = require('../controllers/user.js');
const userRegisterValidator = require('../validators/userRegister.js')

const router = express.Router();

router
    .route('/login')

    /**
     * @api {get} /aggregate//:locationId/availabledates Find aggregate data dates (just in case dating turns fucky)
     * @apiGroup Foo
     *
     * @apiSuccess {Boolean} success=true
     * @apiSuccess {Foo} data
     */
    .post(controller.login)

router
    .route('/register')

    /**
     * @api {get} /aggregate//:locationId/:date/:name Find aggregate data
     * @apiGroup Foo
     *
     * @apiSuccess {Boolean} success=true
     * @apiSuccess {Foo} data
     */
    .post(...userRegisterValidator, controller.register)

module.exports = router;
