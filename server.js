// Load required modules
import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

// Setup environment and folder path
dotenv.config();
const { Client } = pkg;
const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Supabase PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

await client.connect();

// Middleware: parse form data and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // allows serving CSS, JS, images

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname); // EJS templates are in the same folder

// -----------------------------
// ROUTES
// -----------------------------

// Show all blog posts
app.get("/", async (req, res) => {
  const result = await client.query("SELECT * FROM posts ORDER BY id DESC");
  res.render("blog", { posts: result.rows });
});

// Create a new blog post
app.post("/new", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.redirect("/"); // skip if fields are empty
  }

  await client.query(
    "INSERT INTO posts (title, content) VALUES ($1, $2)",
    [title, content]
  );

  res.redirect("/");
});

// Delete a blog post
app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  await client.query("DELETE FROM posts WHERE id = $1", [id]);

  res.redirect("/");
});

// Show edit form for a post
app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;

  const result = await client.query("SELECT * FROM posts WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    return res.redirect("/");
  }

  res.render("edit", { post: result.rows[0] });
});

// Save edited post
app.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  await client.query(
    "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
    [title, content, id]
  );

  res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
