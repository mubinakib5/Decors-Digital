import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

// Connection options similar to the project's mongodb.js
const options = {
  retryWrites: true,
  w: "majority",
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  ...(process.env.NODE_ENV === "development" && {
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  }),
};

const client = new MongoClient(uri, options);

async function verifyMigration() {
  try {
    console.log('🔍 Verifying user migration to admin collection...');
    
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('decors_digital');
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    
    // Get counts
    const userCount = await usersCollection.countDocuments();
    const adminCount = await adminsCollection.countDocuments();
    
    console.log(`📊 Current collection counts:`);
    console.log(`   Users collection: ${userCount} documents`);
    console.log(`   Admins collection: ${adminCount} documents`);
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`\n👥 Users in users collection:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email}) - Role: ${user.role || 'N/A'}`);
    });
    
    // Get all admins
    const admins = await adminsCollection.find({}).toArray();
    console.log(`\n👑 Admins in admins collection:`);
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.username} (${admin.email}) - Role: ${admin.role || 'N/A'}${admin.originalUserId ? ' [Migrated]' : ''}`);
    });
    
    // Check for migrated users
    const migratedAdmins = admins.filter(admin => admin.originalUserId);
    console.log(`\n🔄 Migration verification:`);
    console.log(`   Migrated users found in admins: ${migratedAdmins.length}`);
    
    if (migratedAdmins.length > 0) {
      console.log(`   Migrated users details:`);
      migratedAdmins.forEach((admin, index) => {
        console.log(`     ${index + 1}. ${admin.username} (${admin.email}) - Migrated at: ${admin.migratedAt}`);
      });
    }
    
    // Check for duplicates
    const userEmails = users.map(u => u.email);
    const adminEmails = admins.map(a => a.email);
    const duplicateEmails = userEmails.filter(email => adminEmails.includes(email));
    
    if (duplicateEmails.length > 0) {
      console.log(`\n⚠️  Duplicate emails found in both collections:`);
      duplicateEmails.forEach(email => {
        console.log(`     - ${email}`);
      });
    } else {
      console.log(`\n✅ No duplicate emails found between collections`);
    }
    
    // Summary
    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Total users before migration: ${userCount + migratedAdmins.length}`);
    console.log(`   ✅ Users successfully migrated: ${migratedAdmins.length}`);
    console.log(`   ✅ Users remaining in users collection: ${userCount}`);
    console.log(`   ✅ Total admins (including migrated): ${adminCount}`);
    
    if (userCount === 0) {
      console.log(`\n🎉 All users have been migrated to admin collection!`);
    } else {
      console.log(`\n📝 Note: ${userCount} users remain in the users collection.`);
      console.log(`   Run the cleanup script if you want to remove them.`);
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the verification
verifyMigration()
  .then(() => {
    console.log('🎉 Verification completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });

export { verifyMigration };