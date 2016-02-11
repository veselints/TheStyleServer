'use strict';

let express = require('express'),
    postsController = require('../controllers/posts-controller');

// Defining producers router
let router = express.Router();

router.get('/', postsController.getAll)
    .get('/latest', postsController.getLatest)
    .get('/commented', postsController.getCommentedFull)
    .get('/archived', postsController.getArchivedFull)
    .get('/latestseven', postsController.getLatestSeven)
    .get('/count', postsController.getTotalCount)
    .get('/bysubcategory/:subcategory', postsController.getBySubCategory)
    .post('/filldb', postsController.fillDb)
    .get('/query/:query', postsController.getByquery)
    .get('/:id', postsController.getById)
    .post('/', postsController.createNew)
    .post('/:id', postsController.createComment)
    .delete('/', postsController.emptyDb);

module.exports = function(app) {
    app.use('/api/posts', router);
};
