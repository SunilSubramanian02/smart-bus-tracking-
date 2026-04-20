const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const { verifyToken, restrictTo } = require('../middleware/auth');

// [GET] /api/buses - Get all buses (Authenticated users can view buses)
router.get('/', verifyToken, async (req, res) => {
  try {
    const buses = await Bus.find().populate('driverId', 'email').populate('routeId', 'routeName');
    res.status(200).json({ buses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buses', error: error.message });
  }
});

// [POST] /api/buses - Add a new bus (Admin only)
router.post('/', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const { busNumber, driverId, routeId } = req.body;
    const bus = new Bus({ busNumber, driverId, routeId });
    await bus.save();
    res.status(201).json({ message: 'Bus created successfully', bus });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bus', error: error.message });
  }
});

// [PUT] /api/buses/:id - Update bus details (Admin only)
router.put('/:id', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.status(200).json({ message: 'Bus updated successfully', bus });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bus', error: error.message });
  }
});

// [DELETE] /api/buses/:id - Delete a bus (Admin only)
router.delete('/:id', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bus', error: error.message });
  }
});

module.exports = router;
