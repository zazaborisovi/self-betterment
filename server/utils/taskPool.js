const taskPool = [
    // BODY
    { task: "Pushups", unit: "reps", category: "body", baseQuantity: 10, baseXp: 20 },
    { task: "Morning Jog", unit: "km", category: "body", baseQuantity: 2, baseXp: 100 },
    { task: "Plank", unit: "minutes", category: "body", baseQuantity: 1, baseXp: 30 },

    // MIND
    { task: "Read Book", unit: "pages", category: "mind", baseQuantity: 10, baseXp: 50 },
    { task: "Coding Sprint", unit: "hours", category: "mind", baseQuantity: 1, baseXp: 150 },
    { task: "Logic Puzzles", unit: "times", category: "mind", baseQuantity: 3, baseXp: 40 },

    // SOUL
    { task: "Meditation", unit: "minutes", category: "soul", baseQuantity: 5, baseXp: 40 },
    { task: "Journal Entry", unit: "times", category: "soul", baseQuantity: 1, baseXp: 50 },
    { task: "Digital Detox", unit: "hours", category: "soul", baseQuantity: 2, baseXp: 80 }
];

module.exports = taskPool