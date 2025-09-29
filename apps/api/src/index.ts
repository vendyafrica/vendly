// apps/api/src/index.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../../packages/auth/auth";

const app = express();
const port = 8000;

// Better Auth routes - MUST come before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

// Other middleware
app.use(express.json());

// Your other routes
app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});