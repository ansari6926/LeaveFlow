import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/database.json');

const INITIAL_DATA = {
  users: [
    {
      id: 'usr_emp1',
      email: 'employee@leaveflow.com',
      passwordHash: 'Password123!', // In production use bcrypt, plain check for simplicity
      name: 'Sarah Jenkins',
      role: 'EMPLOYEE',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      balances: {
        ANNUAL: { total: 15, used: 3, available: 12 },
        CASUAL: { total: 10, used: 4, available: 6 },
        SICK: { total: 10, used: 2, available: 8 }
      }
    },
    {
      id: 'usr_emp2',
      email: 'alex@leaveflow.com',
      passwordHash: 'Password123!',
      name: 'Alex Rivera',
      role: 'EMPLOYEE',
      department: 'Product Design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      balances: {
        ANNUAL: { total: 15, used: 5, available: 10 },
        CASUAL: { total: 10, used: 5, available: 5 },
        SICK: { total: 10, used: 3, available: 7 }
      }
    },
    {
      id: 'usr_mgr1',
      email: 'manager@leaveflow.com',
      passwordHash: 'Password123!',
      name: 'Marcus Vance',
      role: 'MANAGER',
      department: 'Engineering Management',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      balances: {
        ANNUAL: { total: 20, used: 5, available: 15 },
        CASUAL: { total: 10, used: 3, available: 7 },
        SICK: { total: 10, used: 0, available: 10 }
      }
    }
  ],
  leaveRequests: [
    {
      id: 'req_101',
      userId: 'usr_emp1',
      userName: 'Sarah Jenkins',
      userEmail: 'employee@leaveflow.com',
      leaveType: 'ANNUAL',
      startDate: '2026-09-01',
      endDate: '2026-09-03',
      durationType: 'FULL_DAY',
      daysCount: 3,
      reason: 'Attending tech conference & annual vacation',
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'Marcus Vance',
      reviewedAt: '2026-08-10T10:00:00.000Z',
      createdAt: '2026-08-09T14:30:00.000Z'
    },
    {
      id: 'req_102',
      userId: 'usr_emp2',
      userName: 'Alex Rivera',
      userEmail: 'alex@leaveflow.com',
      leaveType: 'CASUAL',
      startDate: '2026-09-10',
      endDate: '2026-09-10',
      durationType: 'FULL_DAY',
      daysCount: 1,
      reason: 'Personal home maintenance',
      status: 'PENDING',
      rejectionReason: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: '2026-08-14T09:15:00.000Z'
    }
  ]
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getDb() {
  const dir = path.dirname(DB_FILE);
  ensureDir(dir);
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db file, resetting to initial', err);
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    return INITIAL_DATA;
  }
}

export function saveDb(data) {
  const dir = path.dirname(DB_FILE);
  ensureDir(dir);
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function resetDb() {
  saveDb(INITIAL_DATA);
  return INITIAL_DATA;
}
