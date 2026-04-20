const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  radius: { type: Number, default: 50 }, // in meters (for geofencing)
  order: { type: Number, required: true }
});

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    unique: true,
  },
  totalDistance: {
    type: Number, 
    default: 0
  },
  stops: [stopSchema]
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
