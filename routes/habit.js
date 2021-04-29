const express = require("express");
const router = express.Router();
const db = require("./../lib/db");

router.get("/:habitId", function (req, res, next) {
  if (!req.query.user_id) {
    res.status(400).send("there is no queryString data of user_id");
  }
  const userId = req.query.user_id;
  const habitId = req.params.habitId;

  db.query(
    `
    SELECT 
    uhh.id AS userHabitId, chu.create_date as createDate,
    uhh.time, uhh.alarm_flag AS alarmFlag, uhh.alarm_time AS alarmTime, uhh.alarm_music AS alarmMusic, uhh.alarm_haptic AS alarmHaptic,
    uhh.repeat_mon AS repeatMon, uhh.repeat_tue AS repeatTue, uhh.repeat_wed AS repeatWed,
    uhh.repeat_thu AS repeatThu, uhh.repeat_fri AS repeatFri, uhh.repeat_sat AS repeatSat, uhh.repeat_sun AS repeatSun, uhh.memo
    FROM     user_has_habit      AS uhh
    JOIN challenge_has_habit AS chh ON chh.id = uhh.challenge_habit_id
    JOIN challenge           AS c   ON c.id = chh.challenge_id
    JOIN challenge_has_user  AS chu ON chu.challenge_id = c.id
    WHERE uhh.user_id = ?
    AND chh.habit_id = ?
    AND chu.user_id = ?
    AND chh.challenge_id = (
    SELECT challenge_id
    FROM challenge_has_user chu
    WHERE user_id = ? AND end_flag = 0 )`,
    [userId, habitId, userId, userId],
    (err, detailList) => {
      if (err) {
        console.log(err);
        next(err);
      }
      details = detailList[0];
      db.query(
        `
        SELECT date, done_flag
        FROM habit_history AS hh
        JOIN user_has_habit      AS uhh ON uhh.id = hh.user_habit_id
        JOIN challenge_has_habit AS chh ON chh.id = uhh.challenge_habit_id
        WHERE uhh.user_id = ?
        AND chh.habit_id = ?
        AND chh.challenge_id = (
          SELECT challenge_id
          FROM challenge_has_user chu
          WHERE user_id = ? AND end_flag = 0 )`,
        [userId, habitId, userId],
        (err, history) => {
          if (err) next(err);
          details.history = history;
          res.status(200).json(details);
        }
      );
    }
  );
});

module.exports = router;
