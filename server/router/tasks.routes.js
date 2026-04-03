const taskRouter = require('express').Router()
const {getTasks , dailyTasks} = require('../controllers/tasks.controller')
const protect = require('../middlewares/protect')

taskRouter.get("/" , protect ,  getTasks)
taskRouter.post("/" , protect , dailyTasks)

module.exports = taskRouter