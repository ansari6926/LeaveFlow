import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { getDb, resetDb } from './db.js';
import { 
  submitLeaveRequest, 
  approveLeaveRequest, 
  rejectLeaveRequest, 
  setDeliberateRedRunBug 
} from './services/leaveService.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'leaveflow_secure_jwt_secret_key_2026';

app.use(cors());
app.use(express.json());

// Auth Middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token.' });
    }
    const db = getDb();
    const user = db.users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User no longer exists.' });
    }
    req.user = user;
    next();
  });
}

// Manager Auth Middleware
export function requireManager(req, res, next) {
  if (req.user.role !== 'MANAGER') {
    return res.status(403).json({ error: 'Access denied: Manager privileges required.' });
  }
  next();
}

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    token,
    user: userWithoutPassword
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const { passwordHash, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// LEAVE ROUTES
app.get('/api/leave/balances', authenticateToken, (req, res) => {
  res.json({ balances: req.user.balances });
});

app.get('/api/leave/requests', authenticateToken, (req, res) => {
  const db = getDb();
  let requests;

  if (req.user.role === 'MANAGER') {
    // Managers can see all leave requests
    requests = db.leaveRequests;
  } else {
    // Employees can only see their own leave requests
    requests = db.leaveRequests.filter(r => r.userId === req.user.id);
  }

  res.json({ requests });
});

app.post('/api/leave/requests', authenticateToken, (req, res) => {
  try {
    const { leaveType, startDate, endDate, durationType, reason } = req.body;
    const newRequest = submitLeaveRequest({
      userId: req.user.id,
      leaveType,
      startDate,
      endDate,
      durationType,
      reason
    });
    res.status(201).json({ message: 'Leave request submitted successfully.', request: newRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/leave/requests/:id/approve', authenticateToken, requireManager, (req, res) => {
  try {
    const { id } = req.params;
    const result = approveLeaveRequest(id, req.user);
    res.json({ message: 'Leave request approved successfully.', ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/leave/requests/:id/reject', authenticateToken, requireManager, (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const request = rejectLeaveRequest(id, req.user, rejectionReason);
    res.json({ message: 'Leave request rejected successfully.', request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// EMPLOYEES LIST FOR MANAGER
app.get('/api/users/employees', authenticateToken, requireManager, (req, res) => {
  const db = getDb();
  const employees = db.users
    .filter(u => u.role === 'EMPLOYEE')
    .map(({ passwordHash, ...u }) => u);
  res.json({ employees });
});

// TEST & ASSESSMENT HARNESS CONTROL ENDPOINTS
app.post('/api/test/red-run-toggle', (req, res) => {
  const { active } = req.body;
  setDeliberateRedRunBug(!!active);
  res.json({ message: `Red Run bug set to ${!!active}` });
});

app.post('/api/test/reset-db', (req, res) => {
  resetDb();
  setDeliberateRedRunBug(false);
  res.json({ message: 'Database reset to initial clean state.' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 LeaveFlow Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
