const express = require("express");
const cors = require("cors");

const challengeRouter = require("./routes/challenge");
const habitRouter = require("./routes/habit");

const port = 4240;
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/challenge", challengeRouter);
app.use("/habit", habitRouter);

app.use(function (req, res, next) {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log("Run Server complete");
});
