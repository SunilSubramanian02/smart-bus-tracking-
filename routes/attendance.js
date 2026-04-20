const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

module.exports = (io) => {
  // [POST] /api/attendance/scan
  router.post('/scan', verifyToken, async (req, res) => {
    try {
      const { studentId, busId } = req.body;
      
      if (!studentId || !busId) {
        return res.status(400).json({ message: 'studentId and busId are required' });
      }

      // Create attendance log (assume boarding for this scan route)
      const attendance = new Attendance({
        studentId,
        busId,
        type: 'boarding'
      });
      
      await attendance.save();

      // Fetch the student to find linked parentId for notification
      const student = await User.findById(studentId);
      
      if (student && student.parentId) {
        // Trigger a real-time notification alert to the parent using Socket.io
        io.to(`parent_${student.parentId}`).emit('student_boarded', {
          message: 'Your child has boarded the bus safely.',
          studentId: student._id,
          busId,
          time: new Date()
        });
      }

      res.status(201).json({ message: 'Boarding logged successfully', data: attendance });
    } catch (error) {
      console.error('Scan error:', error);
      res.status(500).json({ message: 'Error logging attendance', error: error.message });
    }
  });

  return router;
};
