const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    test
// @access  Private
router.get('/', (req, res) => res.send('User route'));

// @route   POST api/users
// @desc    register user
// @access  Private
router.post('/', (req, res) => {
    console.log(req.body);

    res.send("user post");
});



module.exports = router;