# Smart College Bus Tracking System

A complete backend platform integrating a REST API and a real-time WebSocket connection to provide relative bus tracking for students, drivers, and parents.

## 🚀 The Relative Tracking Engine

This system uses localized real-time tracking based on the **Haversine Formula**. 
Instead of sending meaningless GPS coordinates to the student's app, the backend natively computes the exact geographic distance between the active Bus and the specific Bus Stop the student is waiting at. 

**How it works:**
1. Drivers emit `update_location` roughly every 3-5 seconds.
2. The Node.js server extracts the target Route and loops through the attached array of Stops.
3. The Haversine algorithm calculates the spherical distance in kilometers between the driver's current GPS and the Stop's static GPS.
4. It dynamically calculates an **ETA in minutes** (Distance / Speed).
5. Fast, lightweight WebSocket signals are broadcasted out to the specific target audience.

---

## 📡 Essential REST API Endpoints

All protected API endpoints require an active authorization header:
`Authorization: Bearer <YOUR_JWT_TOKEN>`

### 1. User Login (`POST /api/auth/login`)
* **Body:** `{ "email": "user@example.com", "password": "password" }`
* **Response:** Returns the bearer `token` alongside standard `user` payload.

### 2. Emergency SOS Alert (`POST /api/alerts/sos`)
* **Protected:** Yes (Student Only)
* **Body:** `{ "lat": 12.34, "lng": 56.78 }`
* **Logic:** Emits an immediate high-priority WebSocket broadcast (`emergency_sos`) globally to Admins and dynamically triggers specifically to the linked Parent's room instance.

### 3. QR Boarding Scan (`POST /api/attendance/scan`)
* **Protected:** Yes
* **Body:** `{ "studentId": "...", "busId": "..." }`
* **Logic:** Logs an attendance record against `Attendance.js` and securely alerts the student's isolated `parent_${parentId}` room socket that their specific child has boarded.

---

## 🌐 WebSocket (Socket.io) Real-Time Events

1. **`join_bus`** [Emit] 
   Must pass `{ busId }`. Opens the data stream channel.
2. **`update_location`** [Emit - Driver Only] 
   Continuously pass `{ busId, routeId, lat, lng, speed }` to dictate updates.
3. **`eta_update`** [Listen] 
   Receives `{ distanceKm, etaMinutes, currentLocation }`. The frontend dynamically filters this to their own specific `stopId`.
4. **`student_boarded`** [Listen - Parents Only] 
   Triggers passively when the attendance REST endpoint successfully fires.
