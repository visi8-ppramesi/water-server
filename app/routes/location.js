const express = require('express');
const controller = require('../controllers/location');
const hashCheck = require('../middlewares/checkHash')

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
  .get(controller.list)

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
  .post(controller.listWithFlowdata)

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
  .post(controller.findWithFlowdata)

router
  .route('/:id')

  /**
  * @api {get} /location/:id Find
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  * @apiSuccess {Foo} data
  */
  .get(controller.findById)

  /**
  * @api {put} /location/:id Update
  * @apiGroup Foo
  *
  * @apiParam {String} name
  *
  * @apiSuccess {Boolean} success=true
  */
  .put(controller.update)

  /**
  * @api {delete} /location/:id Delete
  * @apiGroup Foo
  *
  * @apiSuccess {Boolean} success=true
  */
  .delete(controller.delete);

module.exports = router;
