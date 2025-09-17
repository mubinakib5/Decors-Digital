import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

console.log("NextAuth route file loaded");

const client = new MongoClient(process.env.MONGODB_URI);

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials", 
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials, req) {
        console.log("=== NextAuth - Authorize function called ===");
        console.log("NextAuth - Received credentials:", JSON.stringify(credentials, null, 2));
        console.log("NextAuth - Request object:", req ? "Present" : "Not present");
        
        if (!credentials?.username || !credentials?.password) {
          console.log("NextAuth - Missing credentials - username:", !!credentials?.username, "password:", !!credentials?.password);
          return null;
        }

        try {
          // Check environment admin credentials first
          const adminUsername = process.env.ADMIN_USERNAME;
          const adminPassword = process.env.ADMIN_PASSWORD;
          
          console.log("NextAuth - Environment variables check:");
          console.log("  - ADMIN_USERNAME:", adminUsername ? `"${adminUsername}"` : "NOT SET");
          console.log("  - ADMIN_PASSWORD:", adminPassword ? `"${adminPassword}"` : "NOT SET");
          console.log("NextAuth - Provided credentials:");
          console.log("  - username:", `"${credentials.username}"`);
          console.log("  - password:", `"${credentials.password}"`);
          console.log("NextAuth - Comparison results:");
          console.log("  - Username match:", credentials.username === adminUsername);
          console.log("  - Password match:", credentials.password === adminPassword);

          if (adminUsername && adminPassword && 
              credentials.username === adminUsername && 
              credentials.password === adminPassword) {
            console.log("NextAuth - ✅ Admin authentication successful");
            const adminUser = {
              id: "admin",
              name: "Administrator",
              email: "admin@example.com",
              role: "admin",
              username: adminUsername
            };
            console.log("NextAuth - Returning admin user:", JSON.stringify(adminUser, null, 2));
            return adminUser;
          } else {
            console.log("NextAuth - ❌ Admin authentication failed, trying database...");
          }

          // Connect to MongoDB and check both users and admins collections
          console.log("NextAuth - Connecting to MongoDB for user authentication");
          await client.connect();
          const db = client.db('decors_digital');
          const usersCollection = db.collection('users');
          const adminsCollection = db.collection('admins');

          // First check users collection
          let user = await usersCollection.findOne({
            $or: [
              { username: credentials.username },
              { email: credentials.username }
            ]
          });

          // If not found in users, check admins collection
          if (!user) {
            user = await adminsCollection.findOne({
              $or: [
                { username: credentials.username },
                { email: credentials.username }
              ]
            });
            console.log("NextAuth - User found in admins collection:", user ? "YES" : "NO");
          } else {
            console.log("NextAuth - User found in users collection:", user ? "YES" : "NO");
          }

          console.log("NextAuth - User found in database:", user ? "YES" : "NO");

          if (user) {
            console.log("NextAuth - User details:", {
              id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
              hasPassword: !!user.password
            });

            // Verify password
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            console.log("NextAuth - Password validation:", isPasswordValid);

            if (isPasswordValid) {
              console.log("NextAuth - User authentication successful");
              return {
                id: user._id.toString(),
                name: user.name || user.username,
                email: user.email,
                role: user.role || "user",
                username: user.username
              };
            } else {
              console.log("NextAuth - Password validation failed");
            }
          }

          console.log("NextAuth - Authentication failed for:", credentials.username);
          return null;

        } catch (error) {
          console.error("NextAuth - Authentication error:", error);
          return null;
        } finally {
          try {
            await client.close();
          } catch (closeError) {
            console.error("NextAuth - Error closing MongoDB connection:", closeError);
          }
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("=== NextAuth - JWT callback called ===");
      console.log("NextAuth - JWT token:", JSON.stringify(token, null, 2));
      console.log("NextAuth - JWT user:", JSON.stringify(user, null, 2));
      console.log("NextAuth - JWT account:", JSON.stringify(account, null, 2));
      
      if (user) {
        console.log("NextAuth - Adding user data to token");
        token.role = user.role;
        token.username = user.username;
        token.id = user.id;
        
        // Set token expiration based on rememberMe
        if (user.rememberMe === "on" || user.rememberMe === true) {
          token.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
          console.log("NextAuth - JWT token set to 30 days");
        } else {
          token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 1 day
          console.log("NextAuth - JWT token set to 1 day");
        }
      }
      
      console.log("NextAuth - JWT token after processing:", JSON.stringify(token, null, 2));
      return token;
    },
    async session({ session, token }) {
      console.log("=== NextAuth - Session callback called ===");
      console.log("NextAuth - Session token:", JSON.stringify(token, null, 2));
      console.log("NextAuth - Session before processing:", JSON.stringify(session, null, 2));
      
      if (token) {
        console.log("NextAuth - Adding token data to session");
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.id = token.sub || token.id;
      }
      
      console.log("NextAuth - Session after processing:", JSON.stringify(session, null, 2));
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/admin/auth/signin",
    signUp: "/admin/auth/signup",
    error: "/admin/auth/error"
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, metadata);
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Automatically detect URL in production
  url: process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };