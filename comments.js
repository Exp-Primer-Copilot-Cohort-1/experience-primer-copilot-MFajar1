// Create web Server
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route: GET api/posts/test
// @desc: Tests posts route
// @access: Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route: GET api/posts
// @desc: Get posts
// @access: Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 }) // Sort posts by date (descending order)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found.' }));
});

// @route: GET api/posts/:id
// @desc: Get posts by ID
// @access: Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'Post not found.' }));
});

// @route: POST api/posts
// @desc: Create post
// @access: Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Validate input
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    // Create new post object
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        // Get user ID from JWT
        user: req.user.id
    });

    // Save post to database
    newPost.save().then(post => res.json(post));
});

// @route: DELETE api/posts/:id
// @desc: Delete post
// @access: Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Find user profile
    Profile.findOne({ user: req.user.id })
        .then(profile =>