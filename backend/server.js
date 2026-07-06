const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files serving (e.g. for resume downloads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health checks
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'PlacementPro AI API' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api', (_req, res) => {
  res.status(200).json({ message: 'PlacementPro AI backend ready' });
});

// Serve frontend static assets from 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback for Single Page Application client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Centralized error handler (MUST be mounted after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
