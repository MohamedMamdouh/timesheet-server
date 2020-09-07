const express = require("express");
const router = express.Router();
const Projects = require("../models/Projects");

router.get("/", (req, res) =>
  Projects.find({})
    .populate("manager")
    .exec((err, projects) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(projects);
      }
    })
);

router.post("/create", (req, res) => {
  const projectObj = {
    title: req.body.title,
    manager: req.body.manager,
  };
  const newProject = new Projects(projectObj);
  newProject.save((err, project) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(project);
    }
  });
});

router.post("/update", async (req, res) => {
  const updatedProjectObj = {
    title: req.body.title,
    manager: req.body.manager,
  };
  Projects.findByIdAndUpdate(
    req.body.id,
    updatedProjectObj,
    async (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        try {
          const project = await Projects.findById(req.body.id);
          res.status(500).json(project);
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
