// Include app startup modules
require("dotenv/config"); // To use env files
require("./config/database"); // DataBase connections Stablish

// Initialize Express Server
const express = require("express");
const app = express();

//Body Parser integration for Parse incoming request bodies
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

app.listen(3000, () => console.log("App listen on port: 3000"));
