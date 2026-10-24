const express = require('express');
const app = express();
const PORT = 5000;


app.use(express.json());

// Home API
app.get("/", (req, res) => {
  res.send("Express server is running successfully! 🚀");
});

// Test API
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    message: "Users fetched successfully",
    users: [
      { id: 1, name: "Harsh" },
      { id: 2, name: "Rahul" }
    ]
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});