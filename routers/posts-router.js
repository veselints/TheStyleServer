'use strict';

let express = require('express'),
    postsController = require('../controllers/posts-controller');

// Defining producers router
let router = express.Router();

router.get('/', postsController.getAll)
    .get('/latest', postsController.getLatest)
    .get('/count', postsController.getCount)
    //.get('/filldb', postsController.fillDb)
    .get('/:id', postsController.getById)
    .post('/', postsController.createNew);

module.exports = function(app) {
    app.use('/api/posts', router);
};
