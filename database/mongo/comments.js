'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comments = new Schema({
    cid:                { type: String, index: true },
    text:               String,
    aweme_id:           { type: String, index: true },
    create_time:        Number,
    digg_count:         Number,
    status:             Number,
    user: {
        uid:            String,
        short_id:       String,
        nickname:       String,
        gender:         Number,
        signature:      String
    },

    reply_id:           String,
    user_digged:        Number,
    reply_comment:      String,
    reply_to_reply_id:  String,
    is_author_digged:   Boolean,
    stick_position:     Number

    // age: { type: Number, min: 18, index: true },
    // bio: { type: String, match: /[a-z]/ },
    // date: { type: Date, default: Date.now },
});

module.exports = comments;