const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, restrictTo } = require('../middleware/auth');

// [GET] /api/users - Get all users (Admin only)
router.get('/', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    // Exclude passwords from response
    const users = await User.find().select('-password').populate('busId', 'busNumber').populate('parentId', 'email');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// [PUT] /api/users/:id/assign - Assign student to a bus and specific stop (Admin only)
router.put('/:id/assign', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const { busId, stopId, parentId } = req.body;
    
    // Build update object dynamically
    const updateData = {};
    if (busId !== undefined) updateData.busId = busId;
    if (stopId !== undefined) updateData.stopId = stopId;
    if (parentId !== undefined) updateData.parentId = parentId;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error mapping user', error: error.message });
  }
});

// [DELETE] /api/users/:id - Delete user (Admin only)
router.delete('/:id', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;
