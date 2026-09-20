const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.argv[2] || process.env.MONGO_URI;

if (!uri || uri.includes('localhost')) {
  console.error('Error: Please provide your MongoDB Atlas connection string.');
  console.error('Usage: node resume_cluster.js "mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shopkart"');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB Atlas to trigger resume...');
console.log('Target URI:', uri.replace(/:([^:@]+)@/, ':****@'));

const maxAttempts = 15;
const delayMs = 15000;

async function attemptConnect(attempt) {
  try {
    console.log(`\n[Attempt ${attempt}/${maxAttempts}] Sending connection ping to Atlas...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log('🎉 SUCCESS! Connected to MongoDB Atlas.');
    console.log('Your cluster is now RESUMED and actively accepting connections.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log(`Cluster is waking up... (${err.message})`);
    if (attempt < maxAttempts) {
      console.log(`Waiting 15 seconds for Atlas to finish spinning up...`);
      await new Promise((res) => setTimeout(res, delayMs));
      return attemptConnect(attempt + 1);
    } else {
      console.error('Reached max attempts. Please verify your credentials and Atlas IP whitelist (0.0.0.0/0).');
      process.exit(1);
    }
  }
}

attemptConnect(1);
