const express = require("express");

const app = express();

app.use(express.json({ extended: false }));
// Routes
app.use("/api/users", require("./src/api/users"));
app.use("/api/data", require("./src/api/data"));
app.use("/api/login", require("./src/api/login"));
app.use("/api/goals", require("./src/api/goals"));
app.use("/api/weight", require("./src/api/weight"));
app.use("/api/calories", require("./src/api/calories"));
app.use("/api/tdee", require("./src/api/tdee"));
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server up on port " + port);
});
