require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const ideaRoutes = require("./routes/ideas");
const interestRoutes = require("./routes/interests");
const messageRoutes = require("./routes/messages");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, name: "forge-backend" }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/ideas", ideaRoutes);
app.use("/", interestRoutes);
app.use("/", messageRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Forge backend running on http://localhost:${PORT}`);
});
