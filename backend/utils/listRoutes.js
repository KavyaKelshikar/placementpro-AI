const express = require('express');
const path = require('path');

// Configure environments if .env exists
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('--- Express MVC REST API Routes Scanner ---');

try {
  // Import route files
  const authRoutes = require('../routes/authRoutes');
  const studentRoutes = require('../routes/studentRoutes');
  const recruiterRoutes = require('../routes/recruiterRoutes');
  const companyRoutes = require('../routes/companyRoutes');
  const jobRoutes = require('../routes/jobRoutes');
  const resumeRoutes = require('../routes/resumeRoutes');
  const applicationRoutes = require('../routes/applicationRoutes');
  const interviewRoutes = require('../routes/interviewRoutes');
  const notificationRoutes = require('../routes/notificationRoutes');
  const bookmarkRoutes = require('../routes/bookmarkRoutes');
  const analyticsRoutes = require('../routes/analyticsRoutes');

  const app = express();
  app.use(express.json());

  // Mount them
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

  // Traverse the Express router stack
  const routes = [];
  
  function printRoutes(stack, prefix = '') {
    stack.forEach((middleware) => {
      if (middleware.route) {
        // Route middleware
        const pathStr = prefix + middleware.route.path;
        const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase());
        routes.push({ path: pathStr, methods: methods.join(', ') });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        // Nested router
        let routerPrefix = prefix;
        // Extract prefix matching from the regexp if possible
        if (middleware.regexp) {
          const match = middleware.regexp.toString().match(/^\/\^\\(.*?)\\\/\?/);
          if (match && match[1]) {
            routerPrefix = prefix + '/' + match[1].replace(/\\/g, '');
          }
        }
        printRoutes(middleware.handle.stack, routerPrefix);
      }
    });
  }

  printRoutes(app._router.stack);

  console.log(`\nFound ${routes.length} REST endpoints registered:\n`);
  
  // Group routes by controller area for visual clarity
  const groups = {};
  routes.forEach(r => {
    const segment = r.path.split('/')[2] || 'general';
    if (!groups[segment]) groups[segment] = [];
    groups[segment].push(r);
  });

  for (const groupName in groups) {
    console.log(`\n📂 [${groupName.toUpperCase()}] Endpoints:`);
    groups[groupName].forEach(r => {
      console.log(`   *  [${r.methods.padEnd(7)}] -> ${r.path}`);
    });
  }

  console.log('\n✨ Express MVC routing layer compiled successfully with 0 errors!');
  process.exit(0);
} catch (err) {
  console.error('\n❌ Route scanning encountered a syntax or mapping error:');
  console.error(err);
  process.exit(1);
}
