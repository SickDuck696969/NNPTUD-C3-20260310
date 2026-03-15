const express = require('express');
const router = express.Router();
const User = require('../schemas/users');
const Role = require('../schemas/roles');

// Create a new user
router.post('/', async (req, res, next) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;
    const user = new User({ username, password, email, fullName, avatarUrl, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({ deletedAt: null }).populate('role');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get a user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deletedAt: null }).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err)
    {
        next(err);
    }
});

// Update a user by ID
router.put('/:id', async (req, res, next) => {
    try {
        const { username, password, email, fullName, avatarUrl, role, status, loginCount } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { username, password, email, fullName, avatarUrl, role, status, loginCount }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// Soft delete a user by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// Enable a user
router.post('/enable', async (req, res, next) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate({ email, username }, { status: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// Disable a user
router.post('/disable', async (req, res, next) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate({ email, username }, { status: false }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});


module.exports = router;