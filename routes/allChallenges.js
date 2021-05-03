const express = require("express");
const router = express.Router();
const db = require("./../lib/db");

router.get("/", function (req, res, next) {
  db.query(
    `SELECT id AS challengeId, challenge_name AS challengeName, image AS challengeImage FROM challenge`,
    (err, challenges) => {
      if (err) {
        console.log(err);
        next(err);
      }
      res.status(200).json(challenges);
    }
  );
});

module.exports = router;
