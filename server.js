const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { verifyToken, restrictTo } = require('./middleware/auth');

// Load env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://sbt-web-taupe.vercel.app', 'http://localhost:5173'],
    credentials: true,
  }
});

// Security & Middlewares
app.use(helmet());
app.use(cors({
  origin: ['https://sbt-web-taupe.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // max 20 requests per window
  message: 'Too many authentication attempts, please try again later.'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/alerts/sos', authLimiter);

// Models
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Alert = require('./models/Alert');

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

// WebSocket Logic for Real-Time Layer
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Driver and students joining a specific bus room
  socket.on('join_bus', ({ busId }) => {
    const roomName = `bus_${busId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined ${roomName}`);
  });

  // Parent joining their specific room
  socket.on('join_parent_room', (parentId) => {
    const roomName = `parent_${parentId}`;
    socket.join(roomName);
    socket.join('all_parents'); // Global room for testing purposes
    console.log(`Socket ${socket.id} joined ${roomName} and all_parents`);
  });

  // Driver emitting location updates every 3 seconds
  socket.on('update_location', async (data) => {
    try {
      const { busId, routeId, lat, lng, speed } = data;
      
      // 1. Update Bus Location in DB if busId is valid MongoDB ID
      if (busId && mongoose.Types.ObjectId.isValid(busId)) {
        await Bus.findByIdAndUpdate(busId, {
          currentLocation: { lat, lng, speed, updatedAt: new Date() }
        });
      }

      // Broadcast basic location to ALL connected maps globally (Demo Mode)
      io.emit('location_update', { busId, lat, lng, speed });

      // 2. Fetch the Route & Stops for relative tracking
      if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) return;
      const route = await Route.findById(routeId);
      if (!route) return;

      // 3. Process each stop and broadcast personalized ETA updates
      route.stops.forEach(stop => {
        // Calculate Distance
        const distanceKm = calculateDistance(lat, lng, stop.lat, stop.lng);
        
        // Very basic ETA: (Distance in km / Speed in km/h) * 60 = ETA in minutes
        const effectiveSpeed = Math.max(speed, 10); // set minimum speed to prevent infinity
        const etaMinutes = (distanceKm / effectiveSpeed) * 60;

        // Emit personalized data to the unified bus room
        io.to(`bus_${busId}`).emit('eta_update', {
          busId,
          stopId: stop._id,
          distanceKm: distanceKm.toFixed(2),
          etaMinutes: Math.ceil(etaMinutes),
          currentLocation: { lat, lng }
        });

        // Geofencing trigger: If within radius (e.g., radius is in meters)
        if (distanceKm <= (stop.radius / 1000)) {
          io.to(`bus_${busId}`).emit('geofence_entry', {
            stopId: stop._id,
            message: 'Bus is arriving to your stop soon!'
          });
          // Integration note: Trigger Push Notification (FCM) here
        }
      });

    } catch (error) {
      console.error('Error handling location update:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Register REST API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/bus'));
app.use('/api/routes', require('./routes/route'));
app.use('/api/users', require('./routes/user'));
app.use('/api/alerts', require('./routes/alert')(io));
app.use('/api/attendance', require('./routes/attendance')(io));

// MongoDB Connection & Server Start
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/smart-bus-tracker', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => console.error('MongoDB connection error:', err));
