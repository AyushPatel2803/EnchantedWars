const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/match", async (req, res) => {
    // Replace with your actual database retrieval logic
    const matchData = { id: 1, name: "Example Match" };
    res.json(matchData);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});