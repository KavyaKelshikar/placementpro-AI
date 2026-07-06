const mongoose = require('mongoose');
const path = require('path');

// Configure environments if .env exists
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('--- Mongoose Schema Verification Tool ---');

const modelsList = [
  { name: 'User', path: '../models/User' },
  { name: 'Student', path: '../models/Student' },
  { name: 'Recruiter', path: '../models/Recruiter' },
  { name: 'Company', path: '../models/Company' },
  { name: 'Job', path: '../models/Job' },
  { name: 'Resume', path: '../models/Resume' },
  { name: 'Application', path: '../models/Application' },
  { name: 'Interview', path: '../models/Interview' },
  { name: 'Notification', path: '../models/Notification' },
  { name: 'Bookmark', path: '../models/Bookmark' },
];

async function verifySchemas() {
  let hasErrors = false;

  for (const modelInfo of modelsList) {
    try {
      console.log(`\nChecking model: [${modelInfo.name}]...`);
      const Model = require(modelInfo.path);
      
      // Verify schema fields
      const paths = Object.keys(Model.schema.paths);
      console.log(`✅ Loaded successfully. Fields count: ${paths.length}`);
      console.log(`   Fields: ${paths.join(', ')}`);

      // Verify compiled indexes
      const indexes = Model.schema.indexes();
      console.log(`✅ Indexes count: ${indexes.length}`);
      indexes.forEach((idx, i) => {
        const fields = Object.keys(idx[0]).map(f => `${f}:${idx[0][f]}`).join(', ');
        const options = idx[1] ? JSON.stringify(idx[1]) : '';
        console.log(`   Index #${i+1}: { ${fields} } ${options}`);
      });
    } catch (err) {
      console.error(`❌ Error loading model [${modelInfo.name}]:`, err.message);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\n❌ Schema compilation completed with errors.');
    process.exit(1);
  } else {
    console.log('\n✨ All 10 models loaded, compiled, and validated successfully!');
    process.exit(0);
  }
}

verifySchemas();
