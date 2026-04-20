# Smart College Bus Tracking System - API Documentation

This document outlines the REST API endpoints and WebSocket events for the Smart College Bus Tracking System. 

## Authentication & Headers

All protected API routes require a JSON Web Token (JWT). You must include the token in the `Authorization` header of your HTTP requests.

**Header Format:**
```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## REST API Endpoints

### 1. User Login
Authenticate a user (Student, Driver, Parent, or Admin) to receive a JWT token.

- **Endpoint:** `POST /api/auth/login`
- **Protected:** No
- **Rate Limit:** 20 requests per 15 minutes

**Request Body (JSON):**
```json
{
  "email": "student@example.com",
  "password": "yourpassword123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "_id": "64bc8...f9a1",
    "role": "student",
    "email": "student@example.com"
  }
}
```

---

### 2. Trigger SOS Alert
Emits a high-priority emergency alert from a student's device. This triggers instant WebSocket notifications to admins and linked parents.

- **Endpoint:** `POST /api/alerts/sos`
- **Protected:** Yes (Requires `student` role)
- **Rate Limit:** 20 requests per 15 minutes

**Request Body (JSON):**
```json
{
  "lat": 34.052235,
  "lng": -118.243683
}
```
*(Note: `busId` is automatically resolved from the authenticated student's profile context).*

**Success Response (201 Created):**
```json
{
  "message": "SOS Alert triggered successfully",
  "data": {
    "studentId": "64bc8...f9a1",
    "busId": "64bc9...a3b2",
    "eventType": "SOS",
    "location": {
      "lat": 34.052235,
      "lng": -118.243683
    },
    "_id": "64bcc...12fa",
    "createdAt": "2026-04-17T08:00:00.000Z"
  }
}
```

---

### 3. QR Boarding Scan
Logs a student's attendance when boarding the bus and triggers an instant `'student_boarded'` WebSocket notification to the student's linked parent.

- **Endpoint:** `POST /api/attendance/scan`
- **Protected:** Yes

**Request Body (JSON):**
```json
{
  "studentId": "64bc8...f9a1",
  "busId": "64bc9...a3b2"
}
```

**Success Response (201 Created):**
```json
{
  "message": "Boarding logged successfully",
  "data": {
    "studentId": "64bc8...f9a1",
    "busId": "64bc9...a3b2",
    "type": "boarding",
    "_id": "64bcd...98b2",
    "boardedAt": "2026-04-17T08:05:00.000Z"
  }
}
```

---

## Real-Time WebSocket Events (Socket.io)

Connect to the Socket.io server without a specific namespace (using the base URL).

### Client Emitted Events (What the frontend should send)

#### Join Bus Room
Drivers and Students should join the specific bus room to give/receive localized data.
```javascript
socket.emit('join_bus', { busId: "64bc9...a3b2" });
```

#### Update Location (Driver App Only)
Drivers continuously emit their location. The server calculates ETAs using the Haversine formula and broadcasts it.
```javascript
socket.emit('update_location', { 
  busId: "64bc9...a3b2",
  routeId: "64bc1...d4f5",
  lat: 34.052800, 
  lng: -118.243000, 
  speed: 45 
});
```

### Server Emitted Events (What the frontend should listen for)

#### 1. Location Update Broadcast
Received by all users in `bus_${busId}` room. Provides raw, live GPS data.
```javascript
socket.on('location_update', (data) => {
  console.log(data.busId, data.lat, data.lng, data.speed);
});
```

#### 2. Personalized ETA Updates
Dynamically emitted when the driver's location changes, updating ETA for specific stops on a route.
```javascript
socket.on('eta_update', (data) => {
  console.log(`Stop ${data.stopId} ETA: ${data.etaMinutes} minutes`);
});
```

#### 3. Emergency SOS Broadcast
Received globally by the `'admin'` room and pushed specifically to `'parent_${parentId}'`.
```javascript
socket.on('emergency_sos', (data) => {
  console.log(`EMERGENCY: Student ${data.studentName} triggered SOS at coordinates:`, data.location);
});
```

#### 4. Student Boarded Alert
Received by the dynamically bound `'parent_${parentId}'` room when a QR scan is successful.
```javascript
socket.on('student_boarded', (data) => {
  console.log(data.message); // "Your child has boarded the bus safely."
});
```
