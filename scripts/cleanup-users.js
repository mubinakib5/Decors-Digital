const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function cleanupUsersCollection() {
  try {
    console.log('🧹 Starting cleanup of users collection...');
    
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('decors_digital');
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    
    // Get count of users before cleanup
    const userCount = await usersCollection.countDocuments();
    console.log(`📊 Found ${userCount} users in users collection`);
    
    // Get count of admins to verify migration
    const adminCount = await adminsCollection.countDocuments();
    console.log(`📊 Found ${adminCount} admins in admins collection`);
    
    if (userCount === 0) {
      console.log('ℹ️  No users found to cleanup');
      return;
    }
    
    // Show warning
    console.log('\n⚠️  WARNING: This will permanently delete all users from the users collection!');
    console.log('   Make sure the migration was successful before proceeding.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Delete all users
    const deleteResult = await usersCollection.deleteMany({});
    
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} users from users collection`);
    
    // Verify cleanup
    const remainingUsers = await usersCollection.countDocuments();
    console.log(`📊 Remaining users in users collection: ${remainingUsers}`);
    
    if (remainingUsers === 0) {
      console.log('✅ Users collection cleanup completed successfully!');
    } else {
      console.log('⚠️  Some users may still remain in the collection');
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupUsersCollection()
    .then(() => {
      console.log('🎉 Cleanup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupUsersCollection };