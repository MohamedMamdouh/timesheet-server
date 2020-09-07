const express = require("express");
const moment = require("moment");
const router = express.Router();
const Timesheets = require("../models/Timesheets");
const TimeLogs = require("../models/TimeLogs");

router.get("/", (req, res) =>
  Timesheets.find({})
    .populate(["project", "user", "approvedBy"])
    .exec((err, projects) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(projects);
      }
    })
);

router.post("/create", (req, res) => {
  const user = req.body.user;
  const project = req.body.project;
  const year = req.body.year;
  const month = req.body.month;
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
  TimeLogs.find({
    date: {
      $gte: new Date(year, 1, month),
      $lte: new Date(year, daysInMonth, month),
    },
  })
    .populate(["project", "user"])
    .exec((err, logs) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // console.log(logs);
        const durations = logs.map((log) => {
          const from = moment(log.from, "HH:mm");
          const to = moment(log.to, "HH:mm");
          return to.diff(from, "minutes");
        });
        const totalTime = durations.reduce((a, b) => a + b, 0);
        const hours = totalTime / 60;
        const minutes = totalTime % 60;
        const timeSpent = `${parseInt(hours)}:${minutes}`;
        const timesheetObj = {
          project,
          user,
          timeSpent,
          date: new Date(),
          month: req.body.month,
          year: req.body.year,
          manager: req.body.manager,
          approvedBy: null,
          status: "pending",
          ApprovedDate: null,
        };
        const newTimeSheet = new Timesheets(timesheetObj);
        newTimeSheet.save((err, timeSheet) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json(timeSheet);
          }
        });
      }
    });
});

router.post("/update", async (req, res) => {
  const updatedTimesheetObj = {
    approvedBy: req.body.approvedBy,
    status: req.body.status,
    ApprovedDate: new Date(),
  };
  Timesheets.findByIdAndUpdate(
    req.body.id,
    updatedTimesheetObj,
    async (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        try {
          const timesheet = await Timesheets.findById(req.body.id);
          res.status(500).json(timesheet);
        } catch (e) {
          res.status(200).json({ message: e });
        }
      }
    }
  );
});

router.post("/delete", async (req, res) => {
  Timesheets.findOneAndRemove(req.body.id, async (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
