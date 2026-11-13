import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("StudioSpace");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  baseURL: process.env.BETTER_AUTH_URL || "https://studiospace-beta.vercel.app",
  trustedOrigins: [
    "http://localhost:3000",
    "https://studiospace-beta.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [jwt()],
});