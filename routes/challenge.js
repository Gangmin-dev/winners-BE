const express = require("express");
const router = express.Router();
const db = require("./../lib/db");

router.get("/", function (req, res, next) {
  if (!req.query.user_id) {
    res.status(400).send("there is no queryString data of user_id");
  }
  db.query(
    `SELECT COUNT(end_flag) AS isExist FROM challenge_has_user
    WHERE user_id = ? AND end_flag = 0`,
    [req.query.user_id],
    (err, result) => {
      if (err) next(err);
      let response = { result: result[0].isExist };
      if (!result[0].isExist) res.status(200).json(response);
      else {
        db.query(
          `SELECT c.challenge_name AS challengeName, c.d_day AS challengeDDay, c.image AS challengeImage, c.id AS challengeId
           FROM challenge_has_user AS chu
           JOIN challenge      AS c ON c.id = chu.challenge_id
           WHERE user_id = ? AND end_flag = 0;`,
          [req.query.user_id],
          (err, challengeList) => {
            if (err) next(err);
            response.challenge = challengeList[0];
            db.query(
              `
              SELECT 
              h.id AS habitId, h.habit_name AS habitName, h.icon as icon, h.color AS color, h.default_attribute_value AS defaultAttributeValue,
              a.attribute AS attribute, uhh.alarm_flag AS alarmFlag, uhh.alarm_time AS alarmTime
              FROM challenge_has_habit AS chh
              JOIN habit           AS h   ON h.id = chh.habit_id
              JOIN user_has_habit  AS uhh ON uhh.challenge_habit_id = chh.id
              JOIN attribute       AS a   ON a.id = h.attribute_id
              WHERE chh.challenge_id = (
              SELECT challenge_id
              FROM challenge_has_user chu
              WHERE user_id = ? AND end_flag = 0 ) 
              AND uhh.user_id = ?`,
              [req.query.user_id, req.query.user_id],
              (err, habits) => {
                if (err) next(err);
                response.habits = habits;
                res.status(200).json(response);
              }
            );
          }
        );
      }
    }
  );
});

module.exports = router;
