import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: { type: String, default: '' },
  googleId: { type: String, sparse: true },
  isGoogleUser: { type: Boolean, default: false },

  // Platform usernames
  platforms: {
    leetcode: { username: String, connected: { type: Boolean, default: false }, lastSynced: Date },
    interviewbit: { username: String, connected: { type: Boolean, default: false }, lastSynced: Date },
    codechef: { username: String, connected: { type: Boolean, default: false }, lastSynced: Date },
    codeforces: { username: String, connected: { type: Boolean, default: false }, lastSynced: Date }
  },

  // Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalProblems: { type: Number, default: 0 },

  // Streaks
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date },
  weeklyStreak: { type: Number, default: 0 },

  // Settings
  theme: {
    type: String,
    enum: ['cyberpunk', 'amoled', 'matrix', 'minimal'],
    default: 'cyberpunk'
  },
  timezone: { type: String, default: 'UTC' },
  notifications: { type: Boolean, default: true },

  // Role
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshToken: { type: String, select: false }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function() {
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];
  let level = 1;
  for (let i = 0; i < xpThresholds.length; i++) {
    if (this.xp >= xpThresholds[i]) level = i + 1;
    else break;
  }
  this.level = Math.min(level, 10);
  return this.level;
};

// JSON transform — never expose sensitive fields
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
