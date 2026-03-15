const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');

// Create a new role
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const role = new Role({ name, description });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
});

// Get all roles
router.get('/', async (req, res, next) => {
  try {
    const roles = await Role.find({ deletedAt: null });
    res.json(roles);
  } catch (err) {
    next(err);
  }
});

// Get a role by ID
router.get('/:id', async (req, res, next) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, deletedAt: null });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
});

// Update a role by ID
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
});

// Soft delete a role by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    next(err);
  }
});

const User = require('../schemas/users');

// Get all users with a specific role id
router.get('/:id/users', async (req, res, next) => {
    try {
        const users = await User.find({ role: req.params.id, deletedAt: null }).populate('role');
        res.json(users);
    } catch (err) {
        next(err);
    }
});

module.exports = router;