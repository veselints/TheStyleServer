'use strict';

let mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

// Defining producer schema - similar as EF code first for db entry
let postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        lowercase: true
    },
    subCategory: {
        type: String,
        required: true,
        lowercase: true
    },
    tags: {
        type: Array,
        required: true
    },
    picture: {
        type: String,
        required: true
    },

    authorName: {
        type: String,
        required: true
    },

    numberOfVisits: {
        type: Number,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    lastCommentedOn: {
        type: Date,
        required: true
    },

    isArchived: {
        type: Boolean,
        required: true
    },


    comments: [{
      parentId: {
        type: String
      },
      text: {
        type: String,
        required: true
      },
      authorName: {
        type: String,
        required: true
      },
      createdOn: {
        type: Date,
        required: true
      }
    }],



    email: {
        type: String,
        lowercase: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
});

mongoose.model('Post', postSchema);
