import express from "express";
import { db } from "./database/db";
import { users, User, NewUser } from "./database/schema";

const app = express();
app.use(express.json());

// Get all users
app.get("/users", async (_req, res) => {
  const allUsers: User[] = await db.select().from(users);
  res.json(allUsers);
});

// Add user
app.post("/users", async (req, res) => {
  const newUser: NewUser = req.body;
  const inserted = await db.insert(users).values(newUser).returning();
  res.json(inserted[0]);
});

app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));
