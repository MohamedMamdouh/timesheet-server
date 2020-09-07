const express = require("express");
const router = express.Router();
const TimeLogs = require("../models/TimeLogs");

router.get("/", (req, res) =>
  TimeLogs.find({})
    .populate(["project", "user"])
    .exec((err, logs) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(logs);
      }
    })
);

router.post("/timelogbydate", (req, res) =>
  TimeLogs.find({ date: req.body.date })
    .populate(["project", "user"])
    .exec((err, logs) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(logs);
      }
    })
);

router.post("/create", (req, res) => {
  const timelogObj = {
    project: req.body.project,
    user: req.body.user,
    date: req.body.date,
    from: req.body.from,
    to: req.body.to,
  };
  const newTimeLog = new TimeLogs(timelogObj);
  newTimeLog.save((err, timelog) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(timelog);
    }
  });
});

router.post("/update", async (req, res) => {
  const updatedTimeSheetObj = {
    from: req.body.from,
    to: req.body.to,
  };
  TimeLogs.findByIdAndUpdate(
    req.body.id,
    updatedTimeSheetObj,
    async (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        try {
          const timelog = await TimeLogs.findById(req.body.id);
          res.status(500).json(timelog);
        } catch (e) {
          res.status(200).json({ message: e });
        }
      }
    }
  );
});

router.post("/delete", async (req, res) => {
  Projects.findOneAndRemove(req.body.id, async (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
