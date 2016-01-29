'use strict';

let express = require('express'),
    passport = require('passport'),
    postsController = require('../controllers/posts-controller');

require('../authentication-config');

// Defining producers router
let router = express.Router();

router.get('/', postsController.getAll)
    .get('/count', postsController.getCount)
    .get('/:id', postsController.getById)
    .post('/', passport.authenticate('bearer', {
            session: false
        }),
        postsController.createNew)
    .delete('/:id', passport.authenticate('bearer', {
            session: false
        }),
        postsController.deletePost)
    .put('/:id', passport.authenticate('bearer', {
            session: false
        }),
        postsController.edit);

module.exports = function(app) {
    app.use('/api/posts', router);
};
