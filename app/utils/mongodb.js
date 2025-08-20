import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {
  // Modern MongoDB connection options
  retryWrites: true,
  w: "majority",
  // Add connection timeout
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Add server selection timeout
  serverSelectionTimeoutMS: 10000,
  // Add heartbeat frequency
  heartbeatFrequencyMS: 10000,
  // For development, disable SSL validation
  ...(process.env.NODE_ENV === "development" && {
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  }),
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Export connectToDatabase function for API routes
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('hr_system'); // Use a specific database name
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}
