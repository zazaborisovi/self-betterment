const taskRouter = require('express').Router()
const {getTasks , dailyTasks , completeTask} = require('../controllers/tasks.controller')
const protect = require('../middlewares/protect')

taskRouter.get("/" , protect ,  getTasks)
taskRouter.post("/" , protect , dailyTasks)
taskRouter.put("/:id" , protect , completeTask)

module.exports = taskRouter