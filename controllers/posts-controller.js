'use strict';

let mongoose = require('mongoose'),
    fs = require('fs');

require('../models/post-model');
let Post = mongoose.model('Post');

let recentFour = [];
let popularFour = [];
// let randomFour = [];
let latestCommentedSeven = [];
let latestPostedSeven = [];
let latestArchiveddSeven = [];

let refreshLocalCache = function() {
    Post.find({
            isArchived: false
        })
        .select({
            title: 1,
            _id: 1,
            createdOn: 1,
            authorName: 1,
            picture: 1
        })
        .sort({
            createdOn: -1
        })
        .limit(4)
        .exec(function(err, posts) {
            if (err) {
                return;
            }
            recentFour = posts;
        });

    Post.find({
            isArchived: false
        })
        .select({
            title: 1,
            _id: 1,
            createdOn: 1,
            authorName: 1,
            picture: 1
        })
        .sort({
            numberOfVisits: -1
        })
        .limit(4)
        .exec(function(err, posts) {
            if (err) {
                return;
            }
            popularFour = posts;
        });

    Post.find({
            isArchived: false,
            commented: true
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
                return;
            }
            latestCommentedSeven = posts;
        });

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
                return;
            }
            latestArchiveddSeven = posts;
        });

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
                return;
            }
            latestPostedSeven = posts;
        });

};

setInterval(refreshLocalCache, 300000);

let getTotalCount = function(req, res, next) {
    Post.count({}, function(err, count) {
        if (err) {
            next(err);
            return;
        }

        res.status(200);
        res.json({
            count: count
        });
    });
};

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

// Get posts based on search query. Has paging implemented
let getByquery = function(req, res, next) {
    let currentQuery = req.params.query;
    let currentPage = req.query.page || 1;
    currentPage -= 1;

    Post.find({
            isArchived: false
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
            picture: 1,
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
                        posts: posts,
                        commented: latestCommentedSeven,
                        posted: latestPostedSeven
                    });
                });
        });
};

// Gets all commented posts in reverse order of comments. Has paging implemented
let getCommentedFull = function(req, res, next) {
    let currentPage = req.query.page || 1;
    currentPage -= 1;

    Post.find({
            isArchived: false,
            commented: true
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
            picture: 1,
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

// Gets all archived posts in reverse order of their vreation. Has paging implemented
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
            picture: 1,
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

// Home page - gets all posts in reverse order of their creation. Has paging implemented
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
            picture: 1,
            text: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }
            Post.count({
                isArchived: false
            }, function(err, count) {
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

// Gets all posts from a given subcategory in reverse order of their creation. Has paging implemented
let getBySubCategory = function(req, res, next) {
    let currentPage = req.query.page || 1;
    let subcat = req.params.subcategory;
    currentPage -= 1;

    console.log(currentPage);

    Post.find({
            isArchived: false,
            subCategory: subcat
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
            picture: 1,
            text: 1
        })
        .exec(function(err, posts) {
            if (err) {
                next(err);
                return;
            }

            Post.count({
                isArchived: false,
                subCategory: subcat
            }, function(err, count) {
                if (err) {
                    next(err);
                    return;
                }
                res.status(200);
                res.json({
                    count: count,
                    posts: posts,
                    commented: latestCommentedSeven,
                    posted: latestPostedSeven
                });
            });
        });
};

let getLatestSeven = function(req, res, next) {
    res.status(200);
    res.json({
        commented: latestCommentedSeven,
        posted: latestPostedSeven,
        archived: latestArchiveddSeven
    });
};

// Gets all posts
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

// Gets post by id
let getById = function(req, res, next) {
    Post.find({
        "_id": req.params.id
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

        post[0].numberOfVisits += 1;
        post[0].save(function(err) {
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
                    post: post[0],
                    recent: recentFour,
                    popular: popularFour
                });
            }
        });
    });
};

// Creates new post
let createNew = function(req, res, next) {
    var dbPost = new Post(req.body);
    dbPost.commented = false;
    dbPost.isArchived = false;

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

let createComment = function(req, res, next) {
    let newComment = req.body;
    if (!newComment) {
        let e = {
            message: "Bad request",
            status: 400
        };
        next(e);
        return;
    }

    Post.findOne({
        "_id": req.params.id
    }, function(err, post) {
        if (err) {
            next(err);
            return;
        }
        if (!post) {
            let error = {
                message: "Post not found",
                status: 404
            };
            next(error);
            return;
        }
        newComment.createdOn = Date.now();
        post.comments.push(newComment);
        post.save(function(error) {
            if (error) {
                next(error);
                return;
            }
            res.status(201);
            res.json();
        });
    });
};

// Fills the db with sample data
let fillDb = function(req, res, next) {

    let len = req.body.length;

    for (let i = 0; i < len; i++) {
        let newPost = new Post(req.body[i]);

        newPost.save(function(err) {
            if (err) {
                let error = {
                    message: err.message,
                    status: 400
                };
                next(err);
                return;
            }
        });

        console.log(i);
    }

    res.json({});
};

let emptyDb = function(req, res, next) {
    Post.remove({}, function(err) {
        if (err) {
            let error = {
                message: err.message,
                status: 400
            };
            next(err);
            return;
        } else {
            res.status(201);
            res.json({});
        }
    });
};

let controller = {
    getAll,
    getById,
    createNew,
    getCount,
    getTotalCount,
    getLatest,
    fillDb,
    getLatestSeven,
    getBySubCategory,
    getByquery,
    getArchivedFull,
    getCommentedFull,
    emptyDb,
    createComment
};

module.exports = controller;
