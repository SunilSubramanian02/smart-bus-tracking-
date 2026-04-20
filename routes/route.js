const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const { verifyToken, restrictTo } = require('../middleware/auth');

// [GET] /api/routes - Get all routes (Authenticated users)
router.get('/', verifyToken, async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json({ routes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes', error: error.message });
  }
});

// [GET] /api/routes/:id - Get a specific route by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ route });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching route', error: error.message });
  }
});

// [POST] /api/routes - Create a new route mapping (Admin only)
router.post('/', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const { routeName, stops, totalDistance } = req.body;
    const route = new Route({ routeName, stops, totalDistance });
    await route.save();
    res.status(201).json({ message: 'Route created successfully', route });
  } catch (error) {
    res.status(500).json({ message: 'Error creating route', error: error.message });
  }
});

// [PUT] /api/routes/:id - Update route and stops (Admin only)
router.put('/:id', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ message: 'Route updated successfully', route });
  } catch (error) {
    res.status(500).json({ message: 'Error updating route', error: error.message });
  }
});

// [DELETE] /api/routes/:id - Delete a route (Admin only)
router.delete('/:id', verifyToken, restrictTo('admin'), async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting route', error: error.message });
  }
});

module.exports = router;
