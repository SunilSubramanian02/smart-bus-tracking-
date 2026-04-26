const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['student', 'parent', 'driver', 'admin'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
  name: {
    type: String,
  },
  registerNumber: {
    type: String,
  },
  department: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
  },
  stopId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
