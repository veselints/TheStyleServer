'use strict';

let mongoose = require('mongoose');

// Defining user schema - similar as EF code first for db entry
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: Array,
        required: true
    }
});

mongoose.model('User', userSchema);