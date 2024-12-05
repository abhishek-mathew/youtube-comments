import { Client } from "cassandra-driver";

export const client = new Client({
  contactPoints: [
    process.env.DB_CONTACT_POINT_1!,
    process.env.DB_CONTACT_POINT_2!,
    process.env.DB_CONTACT_POINT_3!,
  ],
  localDataCenter: process.env.DB_DATACENTER!,
  credentials: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
  },
  keyspace: process.env.DB_KEYSPACE!,
});

export async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to ScyllaDB!");
  } catch (error) {
    console.error("Failed to connect to ScyllaDB:", error);
    process.exit(1);
  }
}
