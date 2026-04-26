const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const User = require('../models/User');
const { verifyToken, restrictTo } = require('../middleware/auth');
const twilio = require('twilio');

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
        eventType: 'SOS',
        location: { lat, lng }
      });
      if (student.busId) alert.busId = student.busId;

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
      io.to('admin').emit('student-emergency', sosData);
      
      // Emit to ALL connected parents (Global broadcast for testing/demo purposes)
      io.to('all_parents').emit('student-emergency', sosData);

      // 2. Emit to the specific linked 'parent' room and send SMS
      if (student.parentId) {
        io.to(`parent_${student.parentId}`).emit('student-emergency', sosData);

        try {
          const parent = await User.findById(student.parentId);
          if (parent && parent.phoneNumber) {
            if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
              const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
              const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
              const message = `🚨 EMERGENCY SOS 🚨\n${student.name || 'Your child'} has triggered an SOS alert.\nLive location: ${mapsLink}`;
              
              await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: parent.phoneNumber
              });
              console.log('SOS SMS sent successfully to parent:', parent.phoneNumber);
            } else {
              console.warn('Twilio credentials missing. Skipped sending SOS SMS.');
            }
          }
        } catch (smsError) {
          console.error('Failed to send SOS SMS:', smsError.message);
        }
      }

      res.status(201).json({ message: 'SOS Alert triggered successfully', data: alert });
    } catch (error) {
      console.error('SOS error:', error);
      res.status(500).json({ message: 'Error triggering SOS', error: error.message });
    }
  });

  return router;
};
