'use strict';

let mongoose = require('mongoose'),
    fs = require('fs');

require('../models/post-model');
let Post = mongoose.model('Post');

let getCount = function(isArch, next) {
    Post.count({
        isArchived: isArch
    }, function(err, count) {
        if (err) {
            next(err);
            return;
        }

        return next(count);
    });
};

// Get the most info queries
let getByquery = function(req, res, next) {
    let currentQuery = req.params.query;
    let currentPage = req.query.page || 1;
    currentPage -= 1;

    Post.find({
            isArchived: false,
        })
        .or([{
            "title": {
                "$regex": currentQuery,
                "$options": "i"
            }
        }, {
            "category": {
                "$regex": currentQuery,
                "$options": "i"
            }
        }, {
            "subCategory": {
                "$regex": currentQuery,
                "$options": "i"
            }
        }])
        .limit(7)
        .skip(7 * currentPage)
        .sort({
            createdOn: -1
        })
        .select({
            title: 1,
            category: 1,
            _id: 1,
            createdOn: 1,
            authorName: 1,
            // picture: 1,
            text: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }

            Post.count({
                    isArchived: false,
                })
                .or([{
                    "title": {
                        "$regex": currentQuery,
                        "$options": "i"
                    }
                }, {
                    "category": {
                        "$regex": currentQuery,
                        "$options": "i"
                    }
                }, {
                    "subCategory": {
                        "$regex": currentQuery,
                        "$options": "i"
                    }
                }])
                .exec(function(err, count) {
                    if (err) {
                        next(err);
                        return;
                    }
                    res.status(200);
                    res.json({
                        count: count,
                        posts: posts
                    });
                });
        });
};

let getCommentedFull = function(req, res, next) {
    let currentPage = req.query.page || 1;
    currentPage -= 1;
    
    Post.find({
            isArchived: false
        })
        .limit(7)
        .skip(7 * currentPage)
        .sort({
            lastCommentedOn: -1
        })
        .select({
            title: 1,
            category: 1,
            _id: 1,
            createdOn: 1,
            authorName: 1,
            // picture: 1,
            text: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            getCount(false, function(count) {
                res.status(200);
                res.json({
                    count: count,
                    posts: posts
                });
            });
        });
};

let getArchivedFull = function(req, res, next) {
    let currentPage = req.query.page || 1;
    currentPage -= 1;

    Post.find({
            isArchived: true
        })
        .limit(7)
        .skip(7 * currentPage)
        .sort({
            createdOn: -1
        })
        .select({
            title: 1,
            category: 1,
            _id: 1,
            createdOn: 1,
            authorName: 1,
            // picture: 1,
            text: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            getCount(true, function(count) {
                res.status(200);
                res.json({
                    count: count,
                    posts: posts
                });
            });
        });
};

let getLatest = function(req, res, next) {
    let currentPage = req.query.page || 1;
    currentPage -= 1;

    Post.find({
            isArchived: false
        })
        .limit(11)
        .skip(11 * currentPage)
        .sort({
            createdOn: -1
        })
        .select({
            title: 1,
            category: 1,
            _id: 1,
            createdOn: 1,
            authorName: 1,
            // picture: 1,
            text: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            getCount(true, function(count) {
                res.status(200);
                res.json({
                    count: count,
                    posts: posts
                });
            });
        });
};

let getBySubCategory = function(req, res, next) {
    let currentPage = req.query.page || 1;
    currentPage -= 1;

    Post.find({
            isArchived: false,
            subCategory: req.params.subcategory
        })
        .limit(7)
        .skip(7 * currentPage)
        .sort({
            createdOn: -1
        })
        .select({
            title: 1,
            category: 1,
            _id: 1,
            createdOn: 1,
            authorName: 1,
            // picture: 1,
            text: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            getCount(true, function(count) {
                res.status(200);
                res.json({
                    count: count,
                    posts: posts
                });
            });
        });
};

// Get the least info queries
let getLatestCommented = function(req, res, next) {
    Post.find({
            isArchived: false
        })
        .limit(7)
        .sort({
            lastCommentedOn: -1
        })
        .select({
            title: 1,
            _id: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            res.status(200);
            res.json(posts);
        });
};

let getLatestArchived = function(req, res, next) {
    Post.find({
            isArchived: true
        })
        .limit(7)
        .sort({
            createdOn: -1
        })
        .select({
            title: 1,
            _id: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            res.status(200);
            res.json(posts);
        });
};

let getLatestSeven = function(req, res, next) {
    Post.find({
            isArchived: false
        })
        .limit(7)
        .sort({
            createdOn: -1
        })
        .select({
            title: 1,
            _id: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            res.status(200);
            res.json(posts);
        });
};

let getAll = function(req, res, next) {
    Post.find({}, function(err, posts) {
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
        "isArchived": false
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
                message: 'There is no post with the given id.',
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

let fillDb = function(req, res, next) {

    for (let i = 0; i < 20; i++) {
        let comment = {
            text: "I have commented here, but that is not so cool",
            parentId: null,
            authorName: "Veselin",
            createdOn: Date.now()
        };

        var dbPost = new Post();
        dbPost.comments = [comment];
        dbPost.title = "Some post title";
        dbPost.text = " Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        dbPost.category = "sport";
        dbPost.subCategory = "volleyball";
        dbPost.tags = ["sport", "ball", "net"];

        var imgPath = './img/logo.png';
        var bitmap = fs.readFileSync(imgPath);
        var imageBufer = new Buffer(bitmap).toString('base64');
        dbPost.picture = imageBufer;

        dbPost.authorName = "Veselin";
        dbPost.numberOfVisits = 0;
        dbPost.createdOn = Date.now();
        dbPost.lastCommentedOn = Date.now();
        dbPost.isArchived = false;

        dbPost.save(function(err) {
            if (err) {
                let error = {
                    message: err,
                    status: 400
                };
                next(error);
                return;
            }
        });
    }

    res.status(201);
    res.json(dbPost);
};


// let edit = function(req, res, next) {
//     Post.findOne({
//         "_id": req.params.id,
//         "isDeleted": false
//     }, function(err, postToBeModified) {
//         if (err) {
//             let error = {
//                 message: err.message,
//                 status: 400
//             };
//             next(error);
//             return;
//         } else if (!postToBeModified) {
//             let error = {
//                 message: 'There is no user with the given id.',
//                 status: 400
//             };
//             next(error);
//             return;
//         }

//         // let userId = req.user._id;
//         // if (userId != producerToBeModified.userId) {
//         //     let error = {
//         //         message: 'You are not authorized to edit this entry.',
//         //         status: 401
//         //     };
//         //     next(error);
//         //     return;
//         // }

//         postToBeModified.name = req.body.name || postToBeModified.name;
//         postToBeModified.description = req.body.description || postToBeModified.description;
//         postToBeModified.mainProducts = req.body.mainProducts || postToBeModified.mainProducts;
//         postToBeModified.telephone = req.body.telephone || postToBeModified.telephone;
//         postToBeModified.adress = req.body.adress || postToBeModified.adress;

//         postToBeModified.save(function(err) {
//             if (err) {
//                 let error = {
//                     message: err.message,
//                     status: 400
//                 };
//                 next(error);
//                 return;
//             } else {
//                 res.status(200);
//                 res.json(postToBeModified);
//             }
//         });
//     });
// };

let controller = {
    getAll,
    getById,
    createNew,
    getCount,
    getLatest,
    fillDb,
    getLatestCommented,
    getLatestSeven,
    getLatestArchived,
    getBySubCategory,
    getByquery,
    getArchivedFull,
    getCommentedFull
};

module.exports = controller;
