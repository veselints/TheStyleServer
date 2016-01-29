'use strict';

let mongoose = require('mongoose'),
    fs = require('fs');

require('../models/post-model');
let Post = mongoose.model('Post');

let getCount = function(req, res, next) {
    Post.count({}, function(err, count) {
        if (err) {
            next(err);
            return;
        }

        res.status(200);
        res.json(count);
    })
};

let getAll = function(req, res, next) {
    let requestChars = {
        name: '',
        userId: ''
    };
    if (req.query.name) {
        requestChars.name = req.query.name;
    }
    if (req.query.userId) {
        requestChars.userId = req.query.userId;
    }

    Post.find({
        "name": {
            "$regex": requestChars.name,
            "$options": "i"
        },
        "description": {
            "$regex": requestChars.userId,
            "$options": "i"
        },
        "isDeleted": false
    }, 'name type logo', function(err, posts) {
        if (err) {
            let error = {
                message: err.message,
                status: 400
            };
            next(error);
            return;
        }

        res.status(200);
        res.json(posts);
    });
};


let getById = function(req, res, next) {
    Post.find({
        "_id": req.params.id,
        "isDeleted": false
    }, function(err, post) {
        if (err) {
            let error = {
                message: err.message,
                status: 400
            };
            next(error);
            return;
        } else if (!post[0]) {
            let error = {
                message: 'There is no user with the given id.',
                status: 400
            };
            next(error);
            return;
        }

        res.status(200);
        res.json(post[0]);
    });
};

let createNew = function(req, res, next) {
    var dbPost = new Post(req.body);
    dbPost.userId = req.user._id;
    dbPost.email = req.user.email;
    dbPost.isDeleted = false;
    // var imageBufer = new Buffer(req.body.logo);
    // dbProducer.logo = imageBufer;
    // var imgPath = './img/logo.png';
    // dbProducer.img.data = fs.readFileSync(imgPath);
    // dbProducer.img.contentType = 'image/png';

    dbPost.save(function(err) {
        if (err) {
            let error = {
                message: err.message,
                status: 400
            };
            next(error);
            return;
        } else {
            res.status(201);
            res.json(dbPost);
        }
    });
};

let deletePost = function(req, res, next) {
    Post.findOne({
        "_id": req.params.id,
        "isDeleted": false
    }, function(err, post) {
        if (err) {
            let error = {
                message: err.message,
                status: 400
            };
            next(error);
            return;
        } else if (!post) {
            let error = {
                message: 'There is no producer with the given id.',
                status: 400
            };
            next(error);
            return;
        }

        // let userId = req.user._id;
        // if (userId !== producer.userId) {
        //     let error = {
        //         message: 'You are not authorized to delete this entry.',
        //         status: 401
        //     };
        //     next(error);
        //     return;
        // }

        post.isDeleted = true;
        post.save(function(err) {
            if (err) {
                let error = {
                    message: err.message,
                    status: 400
                };
                next(error);
                return;
            } else {
                res.status(200);
                res.json({
                    message: 'Post deleted.'
                });
            }
        });
    });
};

let edit = function(req, res, next) {
    Post.findOne({
        "_id": req.params.id,
        "isDeleted": false
    }, function(err, postToBeModified) {
        if (err) {
            let error = {
                message: err.message,
                status: 400
            };
            next(error);
            return;
        } else if (!postToBeModified) {
            let error = {
                message: 'There is no user with the given id.',
                status: 400
            };
            next(error);
            return;
        }

        // let userId = req.user._id;
        // if (userId != producerToBeModified.userId) {
        //     let error = {
        //         message: 'You are not authorized to edit this entry.',
        //         status: 401
        //     };
        //     next(error);
        //     return;
        // }

        postToBeModified.name = req.body.name || postToBeModified.name;
        postToBeModified.description = req.body.description || postToBeModified.description;
        postToBeModified.mainProducts = req.body.mainProducts || postToBeModified.mainProducts;
        postToBeModified.telephone = req.body.telephone || postToBeModified.telephone;
        postToBeModified.adress = req.body.adress || postToBeModified.adress;

        postToBeModified.save(function(err) {
            if (err) {
                let error = {
                    message: err.message,
                    status: 400
                };
                next(error);
                return;
            } else {
                res.status(200);
                res.json(postToBeModified);
            }
        });
    });
};

let controller = {
    getAll,
    getById,
    createNew,
    deletePost,
    edit,
    getCount
};

module.exports = controller;
