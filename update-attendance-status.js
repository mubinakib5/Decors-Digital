// Script to update existing attendance records from 'present' to 'on time'
const { MongoClient } = require('mongodb');

async function updateAttendanceStatus() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('your-database-name'); // Replace with your actual database name
    const collection = db.collection('attendance');

    // Update all records with status 'present' to 'on time'
    const result = await collection.updateMany(
      { status: 'present' },
      { $set: { status: 'on time' } }
    );

    console.log(`Updated ${result.modifiedCount} attendance records from 'present' to 'on time'`);

  } catch (error) {
    console.error('Error updating attendance records:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
updateAttendanceStatus();