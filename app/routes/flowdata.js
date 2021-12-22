const express = require('express');
const controller = require('../controllers/flowdata');
const hashCheck = require('../middlewares/checkHash')
const passport = require('passport')
const { authenticator } = require('../../config/passport.js')

const router = express.Router();

router
  .route('/')

  /**
  * @api {get} /flowdata List
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo[]} data
  */
  .get(authenticator(passport), controller.list)

  /**
  * @api {post} /flowdata Create
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo} data
  */
  .post(hashCheck, controller.create);

router
  .route('/:id')

  /**
  * @api {get} /flowdata/:id Find
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo} data
  */
  .get(authenticator(passport), controller.findById)

  /**
  * @api {put} /flowdata/:id Update
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  */
  .put(authenticator(passport), controller.update)

  /**
  * @api {delete} /flowdata/:id Delete
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  */
  .delete(authenticator(passport), controller.delete);

module.exports = router;
