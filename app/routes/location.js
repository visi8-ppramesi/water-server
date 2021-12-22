const express = require('express');
const controller = require('../controllers/location');
const hashCheck = require('../middlewares/checkHash')
const passport = require('passport')
const { authenticator } = require('../../config/passport.js')

const router = express.Router();

router
  .route('/')

  /**
  * @api {get} /location List
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo[]} data
  */
  .get(authenticator(passport), controller.list)

  /**
  * @api {post} /location Create
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo} data
  */
  .post(hashCheck, controller.create);

router
  .route('/ping/:id')

  /**
  * @api {get} /ping a location to keep status
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo[]} data
  */
  .post(hashCheck, controller.ping)

router
  .route('/withflowdata')

  /**
  * @api {post} /location/withflowdata listWithFlowdata
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo} data
  */
  .post(authenticator(passport), controller.listWithFlowdata)

router
  .route('/withflowdata/:id')

  /**
  * @api {post} /location/withflowdata listWithFlowdata
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo} data
  */
  .post(authenticator(passport), controller.findWithFlowdata)

router
  .route('/:id')

  /**
  * @api {get} /location/:id Find
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo} data
  */
  .get(authenticator(passport), controller.findById)

  /**
  * @api {put} /location/:id Update
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  */
  .put(authenticator(passport), controller.update)

  /**
  * @api {delete} /location/:id Delete
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  */
  .delete(authenticator(passport), controller.delete);

module.exports = router;
