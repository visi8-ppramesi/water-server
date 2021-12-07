const express = require('express');
const controller = require('../controllers/flowdata');
const hashCheck = require('../middlewares/checkHash')

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
  .get(controller.list)

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
  .get(controller.findById)

  /**
  * @api {put} /flowdata/:id Update
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  */
  .put(controller.update)

  /**
  * @api {delete} /flowdata/:id Delete
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  */
  .delete(controller.delete);

module.exports = router;
