const express = require('express');
require("dotenv").config();

const app = express();
const port = process.env.PORT;

//Connect database
const database = require('./config/database');
database.connect();
//End connect database

const Task = require('./model/task.model');

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({
    deleted: false
  })
  res.json(tasks);
});

app.get('/tasks/detail/:id', async (req, res) => {
  const id = req.params.id;
  const task = await Task.find({
    _id: id,
    deleted: false,
  })
  res.json(task);
})

app.listen(port, () => {
  console.log("app listen on " + port);
})