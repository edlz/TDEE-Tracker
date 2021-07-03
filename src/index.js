const express = require("express");
const pool = require("./db/connections");

const app = express();

app.use(express.json({ extended: false }));
// Routes
app.use("/api/users", require("./api/users"));
app.use("/api/data", require("./api/data"));
app.use("/api/login", require("./api/login"));
app.use("/api/goals", require("./api/goals"));
app.use("/api/weight", require("./api/weight"));
app.use("/api/calories", require("./api/calories"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server up on port " + port);
});
