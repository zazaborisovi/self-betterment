const taskPool = require("./taskPool")

const generateDailyTasks = (userRank , userOptions) =>{
    const multipliers = {"F": 1 , "D": 1.2 , "C": 1.5 , "B": 2 , "A": 2.5 , "S": 3.5 , "S+": 5}
    const userMultiplier = multipliers[userRank]

    const userTasks = taskPool.filter(taskObj => userOptions.includes(taskObj.task))

    return userTasks.map( t => {
        return {
            task: t.task,
            unit: t.unit,
            category: t.category,
            quantity: Math.ceil(t.baseQuantity * userMultiplier),
            xpValue: Math.ceil(t.baseXp * userMultiplier),
            isCompleted: false
        }
    })
}

module.exports = generateDailyTasks