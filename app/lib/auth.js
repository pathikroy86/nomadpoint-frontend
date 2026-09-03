import dns from "node:dns";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient, ServerApiVersion } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is not defined");
}

const globalForMongo = globalThis;

const client =
    globalForMongo.nomadPointMongoClient ||
    new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        serverSelectionTimeoutMS: 10000,
    });

if (!globalForMongo.nomadPointMongoClient) {
    globalForMongo.nomadPointMongoClient = client;
}

if (!globalForMongo.nomadPointMongoConnectPromise) {
    globalForMongo.nomadPointMongoConnectPromise = client.connect();
}

export const ensureDbConnected = () => globalForMongo.nomadPointMongoConnectPromise;

export const db = client.db(process.env.AUTH_DB_NAME || process.env.DB_NAME || process.env.MONGODB_DB || "nomadpoint");

const socialProviders = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
}

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [process.env.BETTER_AUTH_URL, "http://localhost:3002"].filter(Boolean),
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders,
    plugins: [nextCookies()],
});
