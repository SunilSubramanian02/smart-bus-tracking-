const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const User = require('../models/User');
const { verifyToken, restrictTo } = require('../middleware/auth');

module.exports = (io) => {
  // [POST] /api/alerts/sos
  router.post('/sos', verifyToken, restrictTo('student'), async (req, res) => {
    try {
      const { lat, lng } = req.body;
      
      if (lat === undefined || lng === undefined) {
        return res.status(400).json({ message: 'Valid GPS {lat, lng} is required for SOS' });
      }

      // Fetch student to get busId and parentId
      const student = await User.findById(req.user._id);

      const alert = new Alert({
        studentId: req.user._id,
        busId: student.busId || null,
        eventType: 'SOS',
        location: { lat, lng }
      });

      await alert.save();

      const sosData = {
        alertId: alert._id,
        studentId: req.user._id,
        studentName: student.name || 'Student',
        busId: student.busId,
        location: { lat, lng },
        time: new Date()
      };

      // 1. Emit to all connected 'admin' rooms
      io.to('admin').emit('emergency_sos', sosData);

      // 2. Emit to the specific linked 'parent' room
      if (student.parentId) {
        io.to(`parent_${student.parentId}`).emit('emergency_sos', sosData);
      }

      res.status(201).json({ message: 'SOS Alert triggered successfully', data: alert });
    } catch (error) {
      console.error('SOS error:', error);
      res.status(500).json({ message: 'Error triggering SOS', error: error.message });
    }
  });

  return router;
};
