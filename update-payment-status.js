// Script to update all existing expense and income records to 'Paid' status
const { MongoClient } = require('mongodb');

async function updatePaymentStatus() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('test'); // Using default database name from Atlas
    
    // Update all expense records to set isPaid: true
    const expenseCollection = db.collection('expenses');
    const expenseResult = await expenseCollection.updateMany(
      {}, // Update all records
      { $set: { isPaid: true } }
    );
    console.log(`Updated ${expenseResult.modifiedCount} expense records to 'Paid' status`);

    // Update all income records to set isPaid: true
    const incomeCollection = db.collection('income');
    const incomeResult = await incomeCollection.updateMany(
      {}, // Update all records
      { $set: { isPaid: true } }
    );
    console.log(`Updated ${incomeResult.modifiedCount} income records to 'Paid' status`);

    console.log(`Total records updated: ${expenseResult.modifiedCount + incomeResult.modifiedCount}`);

  } catch (error) {
    console.error('Error updating payment status:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
updatePaymentStatus();