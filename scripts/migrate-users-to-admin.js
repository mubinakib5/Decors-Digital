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

async function migrateUsersToAdmin() {
  try {
    console.log('🔄 Starting user migration to admin collection...');
    
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('decors_digital');
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    
    // Get all users from users collection
    const users = await usersCollection.find({}).toArray();
    console.log(`📊 Found ${users.length} users to migrate`);
    
    if (users.length === 0) {
      console.log('ℹ️  No users found to migrate');
      return;
    }
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      try {
        // Check if admin with same email or username already exists
        const existingAdmin = await adminsCollection.findOne({
          $or: [
            { email: user.email },
            { username: user.username }
          ]
        });
        
        if (existingAdmin) {
          console.log(`⚠️  Skipping user ${user.username} - admin with same email/username already exists`);
          skippedCount++;
          continue;
        }
        
        // Transform user data to admin format
        const adminData = {
          name: user.name || user.username,
          username: user.username,
          email: user.email,
          password: user.password, // Keep the same hashed password
          role: 'admin', // Change role from 'user' to 'admin'
          createdAt: user.createdAt || new Date(),
          isActive: true,
          // Keep original user ID as reference
          originalUserId: user._id,
          migratedAt: new Date()
        };
        
        // Insert into admins collection
        const result = await adminsCollection.insertOne(adminData);
        
        if (result.insertedId) {
          console.log(`✅ Migrated user: ${user.username} -> Admin ID: ${result.insertedId}`);
          migratedCount++;
        } else {
          console.log(`❌ Failed to migrate user: ${user.username}`);
        }
        
      } catch (error) {
        console.error(`❌ Error migrating user ${user.username}:`, error.message);
      }
    }
    
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} users`);
    console.log(`⚠️  Skipped (duplicates): ${skippedCount} users`);
    console.log(`📊 Total processed: ${users.length} users`);
    
    // Ask for confirmation before deleting original users
    console.log('\n⚠️  IMPORTANT: Original users are still in the users collection.');
    console.log('   Run the cleanup script separately if you want to remove them.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateUsersToAdmin()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });

export { migrateUsersToAdmin };