const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const Projects = require("../models/Projects");

router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(500).json(users);
  } catch (e) {
    res.status(200).json({ message: e });
  }
});

router.post("/createNewFlow", (req, res) => {
  const projectObj = {
    title: req.body.projectTitle,
  };

  const newProject = new Projects(projectObj);
  newProject.save((err, project) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const employeeObj = {
        firstName: req.body.employeeFirstName,
        lastName: req.body.employeeLastName,
        project: project._id,
      };
      const newUser = new Users(employeeObj);
      newUser.save((err, emp) => {
        if (err) {
          return res.status(500).send("Error");
        } else {
          const managerObj = {
            firstName: req.body.managerFirstName,
            lastName: req.body.managerLastName,
          };
          const newUser = new Users(managerObj);
          newUser.save((err, user) => {
            if (err) {
              return res.status(500).send("Error");
            } else {
              console.log(project);
              Projects.findByIdAndUpdate(
                project._id,
                { manager: user._id, title: project.title },
                async (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  } else {
                    try {
                      const modifiedProject = await Projects.findById(
                        project._id
                      );
                      return res.status(200).json(emp);
                    } catch (e) {
                      return res.status(500).json({ message: e });
                    }
                  }
                }
              );
            }
          });
        }
      });
    }
  });
});

router.post("/create", (req, res) => {
  const userObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  const newUser = new Users(userObj);
  newUser.save((err, user) => {
    if (err) {
      res.status(500).send("Error");
    } else {
      res.status(200).json(user);
    }
  });
});

router.post("/update", async (req, res) => {
  const updatedUserObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  Users.findByIdAndUpdate(req.body.id, updatedUserObj, async (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      try {
        const user = await Users.findById(req.body.id);
        res.status(500).json(user);
      } catch (e) {
        res.status(200).json({ message: e });
      }
    }
  });
});

router.post("/delete", async (req, res) => {
  Users.findOneAndRemove(req.body.id, async (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
